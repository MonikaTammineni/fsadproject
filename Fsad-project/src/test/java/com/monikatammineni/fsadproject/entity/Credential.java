package com.monikatammineni.fsadproject.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "credentials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Credential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "user_id")
    private int userId;

    public Credential(String mobileNumber, String password, int userId) {
        this.email = email;
        this.password = password;
        this.userId = userId;
    }
}

