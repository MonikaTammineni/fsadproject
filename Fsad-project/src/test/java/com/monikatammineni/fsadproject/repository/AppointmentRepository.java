package com.monikatammineni.fsadproject.repository;

import com.monikatammineni.fsadproject.entity.Appointment;
import com.monikatammineni.fsadproject.entity.Credential;
import org.springframework.data.repository.CrudRepository;

public interface AppointmentRepository extends CrudRepository<Appointment, Integer> {
    Appointment findByAppointmentId(int appointmentId);

    <List>Appointment findByPatientId(int userId);

    <List>Appointment findByAppointmentDate(String date);

//    Appointment save(Appointment appointment);

}