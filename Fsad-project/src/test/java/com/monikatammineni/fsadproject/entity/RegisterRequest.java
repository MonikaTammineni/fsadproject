package com.monikatammineni.fsadproject.entity;


import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RegisterRequest {

    private String firstName;

    private String lastName;

    private String address;

    private Gender gender;

    public enum Gender {
        MALE, FEMALE, OTHER
    }

    private Date dateOfBirth;

    private String mobileNumber;

    private String email;

    private String password;

    private AccountType accountType;

    public enum AccountType {
        ADMIN, PATIENT, DOCTOR, STAFF
    }



    private boolean status;
}