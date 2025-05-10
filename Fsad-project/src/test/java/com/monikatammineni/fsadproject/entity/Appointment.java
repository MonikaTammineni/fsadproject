package com.monikatammineni.fsadproject.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Table(name = "appointment")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer appointmentId;
    private int patientId;
    private String appointmentDate;
    private String appointmentTime;
    @Enumerated(EnumType.STRING)
    private statusType status; // e.g., "scheduled", "completed", "cancelled"
    private String notes; // Additional notes or comments about the appointment
    private int createdByUserId; // ID of the user who created the appointment
    private int doctorId; // ID of the doctor associated with the appointment

    public enum statusType {
        SCHEDULED, CHECKED_IN, CANCELLED, COMPLETED, NO_SHOW,LAB_TESTS
    }
}