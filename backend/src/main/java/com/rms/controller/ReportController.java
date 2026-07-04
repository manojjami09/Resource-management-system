package com.rms.controller;

import com.rms.dto.ReportDto;
import com.rms.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/utilization")
    public ResponseEntity<ReportDto> getUtilizationReport() {
        return ResponseEntity.ok(reportService.generateUtilizationReport());
    }

    @GetMapping("/project-summary")
    public ResponseEntity<ReportDto> getProjectSummaryReport() {
        return ResponseEntity.ok(reportService.generateProjectSummaryReport());
    }

    @GetMapping("/bench")
    public ResponseEntity<ReportDto> getBenchReport() {
        return ResponseEntity.ok(reportService.generateBenchReport());
    }

    @GetMapping("/forecast")
    public ResponseEntity<ReportDto> getForecastReport() {
        return ResponseEntity.ok(reportService.generateForecastReport());
    }
}
