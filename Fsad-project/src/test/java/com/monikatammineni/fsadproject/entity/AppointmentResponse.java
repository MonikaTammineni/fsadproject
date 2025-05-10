package com.monikatammineni.fsadproject.entity;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AppointmentResponse {
    private Integer appointmentId;
    private int patientId;
    private String patientFirstName;
    private String patientLastName;
    private String appointmentDate;
    private String appointmentTime;
    @Enumerated(EnumType.STRING)
    private Appointment.statusType status; // e.g., "scheduled", "completed", "cancelled"
    private String notes; // Additional notes or comments about the appointment
    private int createdByUserId; // ID of the user who created the appointment
    private String createdByFirstName;
    private String createdByLastName;
    private int doctorId; // ID of the doctor associated with the appointment
    private String doctorFirstName;
    private String doctorLastName;
}