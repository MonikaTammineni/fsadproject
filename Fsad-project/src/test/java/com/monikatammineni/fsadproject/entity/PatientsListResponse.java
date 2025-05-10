package com.monikatammineni.fsadproject.entity;
import lombok.*;

import java.util.Date;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PatientsListResponse {

    @Getter
    @Setter
    @AllArgsConstructor
    @ToString
    public class Patient {
        private int id;
        private String firstName;
        private String lastName;
        private String mobileNumber;
        private Date dateOfBirth;
        private String gender;
    }

    private Patient[] patients;

}
