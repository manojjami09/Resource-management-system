package com.rms.controller;

import com.rms.service.InsightsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/insights")
public class InsightsController {

    @Autowired
    private InsightsService insightsService;

    @GetMapping("/manager-summary")
    public ResponseEntity<Map<String, String>> getManagerSummary() {
        return ResponseEntity.ok(Map.of("summary", insightsService.getManagerSummary()));
    }
}
