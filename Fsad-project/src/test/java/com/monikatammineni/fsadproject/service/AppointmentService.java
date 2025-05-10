package com.monikatammineni.fsadproject.service;

import com.monikatammineni.fsadproject.entity.Appointment;
import com.monikatammineni.fsadproject.entity.AppointmentResponse;
import com.monikatammineni.fsadproject.entity.User;
import com.monikatammineni.fsadproject.jwt.TokenHelper;
import com.monikatammineni.fsadproject.repository.AppointmentRepository;
import com.monikatammineni.fsadproject.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenHelper tokenHelper;


    //logger
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AppointmentService.class);

    public ResponseEntity<Object> getAllAppointments() {
        // Logic to retrieve all appointments
        List<Appointment> list = (List<Appointment>) appointmentRepository.findAll();
        List<AppointmentResponse> outputList = new ArrayList<>();
        //go through each item in list and fetch user detials and put each one in outputlist
        list.forEach(item -> {
            AppointmentResponse temp = new AppointmentResponse();
            temp.setAppointmentId(item.getAppointmentId());
            temp.setAppointmentDate(item.getAppointmentDate());
            temp.setAppointmentTime(item.getAppointmentTime());
            temp.setNotes(item.getNotes());
            //finish off the rest
            temp.setStatus(item.getStatus());

            temp.setPatientId(item.getPatientId());
            User user = userRepository.findById(item.getPatientId());
            temp.setPatientFirstName(user.getFirstName());
            temp.setPatientLastName(user.getLastName());

            temp.setDoctorId(item.getDoctorId());
            user = userRepository.findById(item.getDoctorId());
            temp.setDoctorFirstName(user.getFirstName());
            temp.setDoctorLastName(user.getLastName());

            temp.setCreatedByUserId(item.getCreatedByUserId());
            user = userRepository.findById(item.getCreatedByUserId());
            temp.setCreatedByFirstName(user.getFirstName());
            temp.setCreatedByLastName(user.getLastName());

            outputList.add(temp);
        });
        //return response with the list of appointments and also message
        if (list.isEmpty()) {
            return ResponseEntity.ok("No appointments found");
        }
        return ResponseEntity.ok(outputList);
    }

    public ResponseEntity<Object> getAppointment(int appointmentId) {
        // Logic to retrieve a specific appointment by ID
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointmentId));
        return ResponseEntity.ok(appointment);
    }

    public ResponseEntity<Object> editAppointment(Appointment appointment) {
        // Logic to edit an existing appointment
        Appointment existingAppointment = appointmentRepository.findById(appointment.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointment.getAppointmentId()));
        // Update the existing appointment with new details
        existingAppointment.setAppointmentDate(appointment.getAppointmentDate());
        existingAppointment.setAppointmentTime(appointment.getAppointmentTime());
        existingAppointment.setNotes(appointment.getNotes());
        existingAppointment.setStatus(appointment.getStatus());
        existingAppointment.setDoctorId(appointment.getDoctorId());
        appointmentRepository.save(existingAppointment);

        return ResponseEntity.ok("Appointment with ID " + appointment.getAppointmentId() + " edited successfully");
    }

    public ResponseEntity<Object> deleteAppointment(int appointmentId) {
        // Logic to delete an appointment by ID
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointmentId));
        appointmentRepository.delete(appointment);
        return ResponseEntity.ok("Appointment with ID " + appointmentId + " deleted successfully");
    }

    public ResponseEntity<Object> createAppointment(String token, Appointment appointment) {
        // Logic to create a new appointment
        Claims claims = TokenHelper.getClaims(token);
        if (claims == null) {
            return ResponseEntity.status(401).body("Invalid or expired token.");
        }
        else{
            int createdByUserid = claims.get("id", Integer.class);
            appointment.setCreatedByUserId(createdByUserid);
        }
        log.info(appointment.toString());
        appointmentRepository.save(appointment);
        return ResponseEntity.ok("Appointment created successfully.");
    }

    public ResponseEntity<Object> getAllAppointmentsByPatientId(int patientId) {
        // Logic to retrieve all appointments for a specific user by user ID
        List<Appointment> appointments = Collections.singletonList(appointmentRepository.findByPatientId(patientId));
        if (appointments.isEmpty()) {
            return ResponseEntity.ok("No appointments found for patient ID: " + patientId);
        }
        return ResponseEntity.ok(appointments);
    }

    public ResponseEntity<Object> getAppointmentsByDate(String date) {
        // Logic to retrieve appointments by date
        List<Appointment> appointments = Collections.singletonList(appointmentRepository.findByAppointmentDate(date));
        if (appointments.isEmpty()) {
            return ResponseEntity.ok("No appointments found for date: " + date);
        }
        return ResponseEntity.ok(appointments);
    }
}