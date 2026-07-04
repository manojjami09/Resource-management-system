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

    @GetMapping("/recent-activity")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivity() {
        // Return some basic mock activity to fulfill the frontend's UI requirements,
        // since we haven't built a full audit-log/activity-feed table yet.
        return ResponseEntity.ok(List.of(
                Map.of("id", "1", "type", "project", "message", "New project 'E-Commerce Platform' kicked off", "timestamp", "2 hours ago", "user", "Admin", "avatar", "https://i.pravatar.cc/150?u=admin"),
                Map.of("id", "2", "type", "allocation", "message", "John Doe allocated to E-Commerce Platform", "timestamp", "5 hours ago", "user", "Manager", "avatar", "https://i.pravatar.cc/150?u=manager"),
                Map.of("id", "3", "type", "employee", "message", "New employee Bob Johnson onboarded", "timestamp", "1 day ago", "user", "HR", "avatar", "https://i.pravatar.cc/150?u=hr")
        ));
    }

    @GetMapping("/upcoming-rolloffs")
    public ResponseEntity<List<Map<String, Object>>> getUpcomingRolloffs() {
        // Mock upcoming rolloffs based on current active allocations that end soon
        return ResponseEntity.ok(List.of(
                Map.of("employeeId", "EMP-042", "employeeName", "John Doe", "projectName", "Mobile App Backend", "rolloffDate", "15 Aug 2026", "utilization", 100, "department", "Engineering", "skills", List.of("Java", "Spring Boot"), "avatar", "https://i.pravatar.cc/150?u=john"),
                Map.of("employeeId", "EMP-045", "employeeName", "Jane Smith", "projectName", "Data Migration Tool", "rolloffDate", "22 Aug 2026", "utilization", 100, "department", "Engineering", "skills", List.of("Node.js", "React"), "avatar", "https://i.pravatar.cc/150?u=jane")
        ));
    }

    @GetMapping("/ai-insights")
    public ResponseEntity<List<Map<String, Object>>> getAIInsights() {
        return ResponseEntity.ok(List.of(
            Map.of("id", "1", "message", "John Doe is rolling off Mobile App Backend in 30 days.", "priority", "critical", "category", "allocation"),
            Map.of("id", "2", "message", "High demand for 'React' skills in upcoming pipeline projects.", "priority", "warning", "category", "skills")
        ));
    }
}
