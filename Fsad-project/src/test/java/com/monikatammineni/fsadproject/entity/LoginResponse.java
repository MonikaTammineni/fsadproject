package com.monikatammineni.fsadproject.entity;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    boolean isValidated;
    String token;
    String firstName;
    String lastName;
    String accountType;
    String mobileNumber;
    String message;
}
