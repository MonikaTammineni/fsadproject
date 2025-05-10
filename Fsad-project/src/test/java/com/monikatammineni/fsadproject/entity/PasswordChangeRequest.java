package com.monikatammineni.fsadproject.entity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PasswordChangeRequest {
    public String oldPassword;
    public String newPassword;
}