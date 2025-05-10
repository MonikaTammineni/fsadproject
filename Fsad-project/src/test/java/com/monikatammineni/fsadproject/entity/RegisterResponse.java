package com.monikatammineni.fsadproject.entity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RegisterResponse {
    private boolean isRegistered;

    private String message;

    private int id;

    private String token;

}
