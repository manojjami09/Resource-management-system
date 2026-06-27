package com.rms.controller;

import com.rms.dto.DashboardStatsDto;
import com.rms.service.DashboardService;
import com.rms.service.ForecastService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private ForecastService forecastService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    @GetMapping("/utilization-trend")
    public ResponseEntity<List<Map<String, Object>>> getUtilizationTrend() {
        // Mock data matching the frontend expectation
        return ResponseEntity.ok(List.of(
                Map.of("month", "Jan", "utilization", 85),
                Map.of("month", "Feb", "utilization", 88),
                Map.of("month", "Mar", "utilization", 90),
                Map.of("month", "Apr", "utilization", 87),
                Map.of("month", "May", "utilization", 92)
        ));
    }

    @GetMapping("/capacity-forecast")
    public ResponseEntity<List<Map<String, Object>>> getCapacityForecast() {
        return ResponseEntity.ok(forecastService.getCapacityForecast());
    }
}
