package com.monikatammineni.fsadproject.service;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;
import com.monikatammineni.fsadproject.entity.Files;
import com.monikatammineni.fsadproject.jwt.TokenHelper;
import com.monikatammineni.fsadproject.repository.FileRepository;
import io.jsonwebtoken.Claims;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

@Service
public class S3Service {

    private final AmazonS3 amazonS3;

    //logger
    private static final Logger log = LoggerFactory.getLogger(S3Service.class);

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Autowired
    private FileRepository fileRepository;


    @Autowired
    private TokenHelper tokenHelper;

    public S3Service(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }
    public String uploadFile(MultipartFile file, String category, int patientUserId, String token) throws IOException {
        if (file == null || file.isEmpty()) {
            return "File is empty or null";
        }

        Claims claims = tokenHelper.getClaims(token);
        int user_id = 0;
        String accountType = null;
        if (claims != null) {
            user_id = claims.get("id", Integer.class);
            accountType = claims.get("account_type", String.class);  // <-- Carefully notice claim key
            log.info("User ID from token: " + user_id);
            log.info("Account Type from token: " + accountType);
        } else {
            return "Invalid token";
        }

        // ✅ Restriction logic
        if (accountType == null || (!accountType.equalsIgnoreCase("ADMIN") && !accountType.equalsIgnoreCase("DOCTOR"))) {
            return "Only Admin or Doctor users are allowed to upload files.";
        }

        try {
            // 1. Prepare data
            String originalFileName = file.getOriginalFilename();
            String fileCode = patientUserId + "_" + System.currentTimeMillis();

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            // 2. Upload to S3 first
            amazonS3.putObject(
                    new PutObjectRequest(
                            bucketName,
                            fileCode,  // Actual object name in S3
                            file.getInputStream(),
                            metadata
                    )
            );

            // 3. Only if S3 upload is successful, save into SQL
            Files uploadedFileRecord = new Files();
            uploadedFileRecord.setFileName(originalFileName);
            uploadedFileRecord.setCategory(category);
            uploadedFileRecord.setUserId(patientUserId);
            uploadedFileRecord.setFileCode(fileCode);
            uploadedFileRecord.setUploadedByUserId(user_id);

            fileRepository.save(uploadedFileRecord);

            return "File uploaded successfully: " + fileCode;
        } catch (Exception e) {
            e.printStackTrace();
            return "Error uploading file: " + e.getMessage();
        }
    }



    public ResponseEntity<?> downloadFile(int fileId, String token) {
        // 1. Validate Token
        Claims claims = tokenHelper.getClaims(token);
        if (claims == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        try {
            Files file = fileRepository.findByFileId(fileId);
            log.info("File Code:"+ file.getFileCode());
            // 2. Fetch from S3
            S3Object s3Object = amazonS3.getObject(bucketName, file.getFileCode());
            S3ObjectInputStream inputStream = s3Object.getObjectContent();
            byte[] fileBytes = IOUtils.toByteArray(inputStream);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFileName() + "\"")
                    .body(fileBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving file: " + e.getMessage());
        }
    }

    public ResponseEntity<?> viewFile(int fileId, String token, String mode) {
        Claims claims = tokenHelper.getClaims(token);
        if (claims == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        try {
            Files file = fileRepository.findByFileId(fileId);
            S3Object s3Object = amazonS3.getObject(bucketName, file.getFileCode());
            S3ObjectInputStream inputStream = s3Object.getObjectContent();
            byte[] fileBytes = IOUtils.toByteArray(inputStream);

            // Determine content type
            String contentType = java.nio.file.Files.probeContentType(Paths.get(file.getFileName()));
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            // Decide Content-Disposition mode
            String dispositionType = "inline";
            if ("attachment".equalsIgnoreCase(mode)) {
                dispositionType = "attachment";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, dispositionType + "; filename=\"" + file.getFileName() + "\"")
                    .body(fileBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving file: " + e.getMessage());
        }
    }

    public ResponseEntity<?> deleteFile(int fileId, String token) {
        Claims claims = tokenHelper.getClaims(token);
        if (claims == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        try {
            Files file = fileRepository.findByFileId(fileId);
            if (file == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found.");
            }

            // Delete from S3
            amazonS3.deleteObject(bucketName, file.getFileCode());

            // Delete from SQL
            fileRepository.delete(file);

            return ResponseEntity.ok("File deleted successfully.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting file: " + e.getMessage());
        }
    }

    public ResponseEntity<?> updateFileDetails(int fileId, String token, Files file) {
        Claims claims = tokenHelper.getClaims(token);
        int newUserId = claims.get("id", Integer.class);
        if (claims == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        try {
            Files existingFile = fileRepository.findByFileId(fileId);
            if (existingFile == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found.");
            }

            // Update fields
            existingFile.setFileName(file.getFileName());
            existingFile.setCategory(file.getCategory());
            existingFile.setUploadedByUserId(newUserId);

            // Save updated record
            fileRepository.save(existingFile);

            return ResponseEntity.ok("File details updated successfully.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating file details: " + e.getMessage());
        }
    }
}