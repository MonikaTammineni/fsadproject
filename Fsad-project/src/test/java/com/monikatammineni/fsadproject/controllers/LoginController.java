package com.monikatammineni.fsadproject.controllers;

import com.monikatammineni.fsadproject.entity.*;
import com.monikatammineni.fsadproject.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class LoginController  {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginRequest loginRequest)
    {
        return ResponseEntity.ok(loginService.login(loginRequest));
    }

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(loginService.register(registerRequest));
    }


    @GetMapping("isValidToken")
    public ResponseEntity<Object> isValidToken(@RequestParam("token") String token) {
        return ResponseEntity.ok(loginService.isValidToken(token));
    }

    @PostMapping("/changePassword")
    public ResponseEntity<Object> changePassword(
            @RequestParam("token") String token,
            @RequestBody PasswordChangeRequest request) {
        return ResponseEntity.ok(loginService.changePassword(token, request.oldPassword, request.newPassword));
    }


}






