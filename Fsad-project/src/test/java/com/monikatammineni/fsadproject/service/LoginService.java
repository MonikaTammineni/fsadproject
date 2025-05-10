package com.monikatammineni.fsadproject.service;


import com.monikatammineni.fsadproject.entity.LoginRequest;
import com.monikatammineni.fsadproject.entity.LoginResponse;
import com.monikatammineni.fsadproject.entity.RegisterRequest;

public interface LoginService {
    public LoginResponse login(LoginRequest loginRequest);

    public Object isValidToken(String token);

    public Object register(RegisterRequest registerRequest);

    public Object editUser(String token, Object user);

    public Object changePassword(String token, String oldPassword, String newPassword);
}


