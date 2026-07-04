package com.rms.controller;

import com.rms.config.DevDataSeeder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dev")
public class DevController {

    @Autowired(required = false)
    private DevDataSeeder devDataSeeder;

    @PostMapping("/seed-force")
    @Transactional
    public ResponseEntity<String> forceSeedData() {
        if (devDataSeeder == null) {
            return ResponseEntity.badRequest().body("DevDataSeeder is not available in the current profile.");
        }
        try {
            devDataSeeder.run();
            return ResponseEntity.ok("Dev data successfully seeded.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error seeding data: " + e.getMessage());
        }
    }
}
