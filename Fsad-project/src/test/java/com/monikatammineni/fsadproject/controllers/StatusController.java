package com.monikatammineni.fsadproject.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class StatusController {
    // This controller can be used to check the status of the application
    // You can add endpoints here to return application health or status information

    // Example endpoint to check if the application is running
    //Make this return a object with field "status" with value "Application is running".
    @GetMapping("/status")
    public ResponseEntity<Object> getStatus() {
        //Make a object with field "status" with value "Application is running"
        // This is a simple status check endpoint
        Object statusResponse = new Object() {
            public final String status = "Application is running";
            public final String message = "Welcome to the Backbone application!";
        };
        return ResponseEntity.ok().body(statusResponse);
    }

}
