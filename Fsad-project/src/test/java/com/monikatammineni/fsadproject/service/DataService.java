package com.monikatammineni.fsadproject.service;

import com.monikatammineni.fsadproject.entity.Files;
import com.monikatammineni.fsadproject.entity.RegisterRequest;
import com.monikatammineni.fsadproject.entity.User;
import com.monikatammineni.fsadproject.jwt.TokenHelper;
import com.monikatammineni.fsadproject.repository.FileRepository;
import com.monikatammineni.fsadproject.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class DataService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private TokenHelper tokenHelper;



    //logger
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DataService.class);

    public ResponseEntity<?> getAllPatients(String token) {

        Claims claims = tokenHelper.getClaims(token);
        if (claims != null) {
            List<User> patientList = userRepository.findByAccountType(RegisterRequest.AccountType.PATIENT.toString());
            return ResponseEntity.ok(patientList);
        } else {
            return ResponseEntity.status(401).body("Invalid or expired token.");
        }
    }

    public ResponseEntity<?> getPatientFiles(String token) {
        Claims claims = tokenHelper.getClaims(token);
        if (claims != null) {
            int userId = claims.get("id", Integer.class);
            List<Files> files = fileRepository.findByUserId(userId);
            if (files.isEmpty()) {
                return ResponseEntity.status(404).body("No files found for the user.");
            } else {
                return ResponseEntity.ok(files);
            }
        } else {
            return ResponseEntity.status(401).body("Invalid or expired token.");
        }
    }


    public ResponseEntity<?> getPatientFileDetails(String token, int patientUserId) {
        Claims claims = tokenHelper.getClaims(token);
        if (claims != null) {
            List<Files> files = fileRepository.findByUserId(patientUserId);
            log.info("Files for the patient {}:{}", patientUserId, files.toString());
            if (files.isEmpty()) {
                return ResponseEntity.status(404).body("No files found for the patient.");
            } else {
                return ResponseEntity.ok(files);
            }
        } else {
            return ResponseEntity.status(401).body("Invalid or expired token.");
        }
    }

    public User getUser(String token) {
        Claims claims = tokenHelper.getClaims(token);
        int id;
        if (claims != null) {
            id = claims.get("id", Integer.class);
            log.info("User ID from token at Get User Info: " +id);
            return userRepository.findById(id);
        } else {
            System.out.println("Failed to parse token.");
            return null;
        }
    }

    public ResponseEntity<?> getAllUsers(String token) {
        try {
            Claims claims = tokenHelper.getClaims(token);
            if (claims == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
            }

            List<User> allUsers = (List<User>) userRepository.findAll();
            return ResponseEntity.ok(allUsers);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch users: " + e.getMessage());
        }
    }

    public ResponseEntity<?> deleteUser(String token, int userId) {
        Claims claims = tokenHelper.getClaims(token);
        if (claims != null) {
            User user = userRepository.findById(userId);
            if (user != null) {
                userRepository.delete(user);
                log.info("User with ID {} has been deleted.", userId);
                return ResponseEntity.ok("User deleted successfully.");
            } else {
                return ResponseEntity.status(404).body("User not found.");
            }
        } else {
            return ResponseEntity.status(401).body("Invalid or expired token.");
        }
    }

    public ResponseEntity<?> getAllDoctorsList(String token) {
        Claims claims = tokenHelper.getClaims(token);
        if (claims != null) {
            List<User> doctorList = userRepository.findByAccountType(RegisterRequest.AccountType.DOCTOR.toString());
            if (doctorList.isEmpty()) {
                return ResponseEntity.status(404).body("No doctors found.");
            } else {
                //limit the response to doctors with only id, firstName and lastName.
                doctorList.forEach(doctor -> {
                    doctor.setEmail(null);
                    doctor.setMobileNumber(null);
                    doctor.setAddress(null);
                    doctor.setDateOfBirth(null);
                    doctor.setGender(null);
                    doctor.setStatus(false);
                    doctor.setCreatedOn(null);
                    doctor.setAccountType(null);
                });
                return ResponseEntity.ok(doctorList);
            }
        } else {
            return ResponseEntity.status(401).body("Invalid or expired token.");
        }
    }
}

