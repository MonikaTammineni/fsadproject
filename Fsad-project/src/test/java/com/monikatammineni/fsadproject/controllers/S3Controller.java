package com.monikatammineni.fsadproject.controllers;

import com.monikatammineni.fsadproject.entity.Files;
import com.monikatammineni.fsadproject.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

//import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/s3")
@CrossOrigin(origins = "*")
public class S3Controller {

    @Autowired
    private S3Service s3Service;

    //Logger
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(S3Controller.class);

    // Upload a file to S3
    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public String uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("category") String category,
                             @RequestParam("patient_user_id") int patientUserId,
                             @RequestParam("token") String token) throws IOException
    {
        log.info("Token Received: "+ token);
        return s3Service.uploadFile(file, category, patientUserId, token);
    }

    // Download a file from S3
    @GetMapping("/downloadFile")
    public ResponseEntity<?> downloadFile(@RequestParam int fileId,
                                          @RequestParam("token") String token) {
        return s3Service.downloadFile(fileId, token);
    }

    @GetMapping("/viewFile")
    public ResponseEntity<?> viewFile(
            @RequestParam int fileId,
            @RequestParam("token") String token,
            @RequestParam(value = "mode", defaultValue = "inline") String mode) {

        ResponseEntity<?> response = s3Service.viewFile(fileId, token, mode);

        // If the response is already ResponseEntity<byte[]> or similar
        if (response.getBody() instanceof byte[] responseBytes) {
            return ResponseEntity.status(response.getStatusCode())
                    .headers(response.getHeaders())
                    .header("X-Frame-Options", "SAMEORIGIN") // or "ALLOWALL"
                    .body(responseBytes);
        }

        return response;
    }
    @DeleteMapping("/deleteFile")
    public ResponseEntity<?> deleteFile(@RequestParam int fileId,
                                        @RequestParam("token") String token) {
        return s3Service.deleteFile(fileId, token);
    }

    @PostMapping("/updateFile")
    public ResponseEntity<?> updateFileDetails(@RequestParam int fileId,
                                               @RequestParam("token") String token,
                                               @RequestBody Files file) throws IOException {
        return s3Service.updateFileDetails(fileId, token, file);
    }


}
