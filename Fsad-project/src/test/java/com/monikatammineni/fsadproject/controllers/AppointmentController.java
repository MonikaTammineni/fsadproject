package com.monikatammineni.fsadproject.controllers;

import com.monikatammineni.fsadproject.entity.Appointment;
import com.monikatammineni.fsadproject.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/appointment")
@CrossOrigin(origins = "*")
public class AppointmentController {
    //getallappotments, getappointment, editAppointment, deleteAppointment, createAppointment, getAllAppointmentsByUserId

    //logger
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AppointmentController.class);

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/getAllAppointments")
    public ResponseEntity<Object> getAllAppointments(@RequestParam("token") String token) {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/getAppointment")
    public ResponseEntity<Object> getAppointment(@RequestParam("token") String token, @RequestParam("appointmentId") int appointmentId) {
        return appointmentService.getAppointment(appointmentId);
    }

    @PostMapping("/editAppointment")
    public ResponseEntity<Object> editAppointment(@RequestParam("token") String token, @RequestBody Appointment appointment) {
        return appointmentService.editAppointment(appointment);
    }

    @PostMapping("/deleteAppointment")
    public ResponseEntity<Object> deleteAppointment(@RequestParam("token") String token, @RequestParam("appointmentId") int appointmentId) {
        return appointmentService.deleteAppointment(appointmentId);
    }

    @PostMapping("/createAppointment")
    public ResponseEntity<Object> createAppointment(@RequestParam("token") String token, @RequestBody Appointment appointment) {
        log.info("Appointment Received: "+ appointment.toString());
        return appointmentService.createAppointment(token, appointment);
    }
    @GetMapping("/getAllAppointmentsByUserId")
    public ResponseEntity<Object> getAllAppointmentsByPatientId(@RequestParam("token") String token, @RequestParam("patientId") int patientId) {
        return appointmentService.getAllAppointmentsByPatientId(patientId);
    }
    //Get appointments by date
    @GetMapping("/getAppointmentsByDate")
    public ResponseEntity<Object> getAppointmentsByDate(@RequestParam("token") String token, @RequestParam("date") String date) {
        return appointmentService.getAppointmentsByDate(date);
    }

}