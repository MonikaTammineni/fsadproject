package com.monikatammineni.fsadproject.service;


import com.monikatammineni.fsadproject.entity.*;
import com.monikatammineni.fsadproject.jwt.TokenHelper;
import com.monikatammineni.fsadproject.repository.CredentialRepository;
import com.monikatammineni.fsadproject.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginServiceImpl implements LoginService {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CredentialRepository credentialRepository;

    @Autowired
    private TokenHelper tokenHelper;

    //logger
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(LoginServiceImpl.class);

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        LoginResponse loginResponse = new LoginResponse();

        Credential credential = credentialRepository.findByEmail(loginRequest.getEmail());

        log.info(passwordEncoder.encode(loginRequest.getPassword()));
        if (credential == null) {
            loginResponse.setValidated(false);
            loginResponse.setMessage("Invalid email or password");
            return loginResponse;
        }

        // Check password using passwordEncoder
        boolean passwordMatches = passwordEncoder.matches(loginRequest.getPassword(), credential.getPassword());

        if (!passwordMatches) {
            loginResponse.setValidated(false);
            loginResponse.setMessage("Invalid email or password");
            return loginResponse;
        }

        // Password matches, continue login
        User user = userRepository.findById(credential.getUserId());
        if(user.isStatus() == false){
            loginResponse.setValidated(false);
            loginResponse.setMessage("User is inactive. Please contact support.");
            return loginResponse;
        }
        else{
            loginResponse.setToken(tokenHelper.createToken(user.getId(), user.getMobileNumber(), String.valueOf(user.getAccountType())));
            loginResponse.setValidated(true);
            loginResponse.setAccountType(String.valueOf(user.getAccountType()));
            loginResponse.setMobileNumber(user.getMobileNumber());
            loginResponse.setFirstName(user.getFirstName());
            loginResponse.setLastName(user.getLastName());
            loginResponse.setMessage("Login successful");
        }
        return loginResponse;
    }



    @Override
    public Object isValidToken(String token) {
        try{
            Claims claims = tokenHelper.getClaims(token);
            if(claims != null)
            {
                return "Valid Token";
            }
            else{
                return "Invalid Token";
            }
        } catch (Exception e) {
            return "Invalid Token";
        }
    }


    @Override
    public RegisterResponse register(RegisterRequest registerRequest) {
        RegisterResponse response = new RegisterResponse();
        String email = registerRequest.getEmail();

        // ✅ 1. Check if user already exists by email
        if (userRepository.findByEmail(email) != null) {
            response.setMessage("Email already exists");
            response.setRegistered(false);
            log.info("Email already exists: " + email);
            return response; // 🚨 Important: Return immediately!
        }

        // ✅ 2. New user registration
        User user = new User();
        Credential credential = new Credential();

        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setMobileNumber(registerRequest.getMobileNumber());
        user.setDateOfBirth(registerRequest.getDateOfBirth());
        user.setEmail(email);
        user.setAccountType(String.valueOf(registerRequest.getAccountType()));
        user.setAddress(registerRequest.getAddress());
        user.setGender(String.valueOf(registerRequest.getGender()));
        user.setStatus(true);

        credential.setUserId(userRepository.save(user).getId());
        credential.setEmail(email);
//        credential.setPassword(registerRequest.getPassword());
        credential.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        credentialRepository.save(credential);

        response.setMessage("User registered successfully");
        response.setToken(tokenHelper.createToken(user.getId(), user.getMobileNumber(), String.valueOf(user.getAccountType())));
        response.setRegistered(true);
        response.setId(credential.getUserId());

        return response;
    }

    @Override
    public Object editUser(String token, Object userObj) {
        Claims claims = tokenHelper.getClaims(token);
        if (claims == null) {
            return "Invalid or expired token.";
        }

        try {
            // Parse the user object to the User class
            User updatedUser = (User) userObj;

            // Fetch existing user
            User existingUser = userRepository.findById(updatedUser.getId());
            if (existingUser == null) {
                return "User not found.";
            }

            // Update fields
            existingUser.setFirstName(updatedUser.getFirstName());
            existingUser.setLastName(updatedUser.getLastName());
            existingUser.setMobileNumber(updatedUser.getMobileNumber());
            existingUser.setDateOfBirth(updatedUser.getDateOfBirth());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setAccountType(updatedUser.getAccountType());
            existingUser.setAddress(updatedUser.getAddress());
            existingUser.setGender(updatedUser.getGender());
            existingUser.setStatus(updatedUser.isStatus());

            userRepository.save(existingUser);

            return "User updated successfully.";
        } catch (Exception e) {
            return "Failed to update user: " + e.getMessage();
        }
    }

    @Override
    public ResponseEntity<?> changePassword(String token, String oldPassword, String newPassword) {
        Claims claims = tokenHelper.getClaims(token);
        if (claims == null) {
            return ResponseEntity.status(401).body("Invalid or expired token.");
        }

        int userId = claims.get("id", Integer.class);
        Credential credential = credentialRepository.findByUserId(userId);

        if (credential == null) {
            return ResponseEntity.status(404).body("User credentials not found.");
        }

        if (!passwordEncoder.matches(oldPassword, credential.getPassword())) {
            return ResponseEntity.status(400).body("Incorrect old password.");
        }

        credential.setPassword(passwordEncoder.encode(newPassword));
        credentialRepository.save(credential);

        return ResponseEntity.ok("Password changed successfully.");
    }


//    @Override
//    public Object getFilesDetails(String token) {
//        Claims claims = tokenHelper.getClaims(token);
//
//        if(claims != null)
//        {
//            int id = claims.get("id", Integer.class);
//            return fileRespository.findFileDetailsByUserId(id);
//        }
//        else{
//            return "Error retreiving the file details";
//        }
//
//    }

//    @Override
//    public byte[] getFile(String fileId, String token) {
//        Claims claims = tokenHelper.getClaims(token);
//        if(claims != null)
//        {
//            return fileRespository.findByFileId(Long.valueOf(fileId)).getFileContent();
//        }
//        else{
//            return null;
//        }
//    }
}

