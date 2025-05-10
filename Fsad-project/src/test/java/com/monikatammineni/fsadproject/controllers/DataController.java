package com.monikatammineni.fsadproject.controllers;

import com.monikatammineni.fsadproject.entity.User;
import com.monikatammineni.fsadproject.repository.UserRepository;
import com.monikatammineni.fsadproject.service.DataService;
import com.monikatammineni.fsadproject.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class DataController {

    @Autowired
    private DataService dataService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private LoginService loginService;

    @GetMapping("/getAllPatients")
    public ResponseEntity<Object> getAllPatients(@RequestParam("token") String token) {
        return ResponseEntity.ok(dataService.getAllPatients(token));
    }

    @PostMapping("/editUser")
    public ResponseEntity<Object> editUser(@RequestParam("token") String token, @RequestBody User user) {
        return ResponseEntity.ok(loginService.editUser(token, user));
    }

    @GetMapping("/getPatientFileDetails")
    public ResponseEntity<Object> getPatientFileDetails(@RequestParam("token") String token, @RequestParam("patient_user_id") int patientUserId) {
        return ResponseEntity.ok(dataService.getPatientFileDetails(token, patientUserId));
    }
    @GetMapping("/getPatientFiles")
    public ResponseEntity<Object> getPatientFiles(@RequestParam("token") String token) {
        return ResponseEntity.ok(dataService.getPatientFiles(token));
    }

    @PostMapping("/getUser")
    public ResponseEntity<Object> getUser(@RequestParam("token") String token) {
        return ResponseEntity.ok(dataService.getUser(token));
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<Object> getAllUsers(@RequestParam("token") String token) {
        return ResponseEntity.ok(dataService.getAllUsers(token));
    }

    @PostMapping("/deleteUser")
    public ResponseEntity<Object> deleteUser(@RequestParam("token") String token, @RequestParam("user_id") int userId) {
        return ResponseEntity.ok(dataService.deleteUser(token, userId));
    }

    @PostMapping("/getAllDoctorsList")
    public ResponseEntity<Object> getAllDoctorsList(@RequestParam("token") String token) {
        return ResponseEntity.ok(dataService.getAllDoctorsList(token));
    }
}
