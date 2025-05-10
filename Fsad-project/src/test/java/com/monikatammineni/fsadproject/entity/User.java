package com.monikatammineni.fsadproject.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;


@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String firstName;

    private String lastName;

    private String address;

    private String gender;

    private Date dateOfBirth;

    private String mobileNumber;

    private String email;

    private String accountType;

    private boolean status;

    @CreationTimestamp
    private Date createdOn;

}