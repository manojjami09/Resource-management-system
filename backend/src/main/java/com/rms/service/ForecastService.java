package com.rms.service;

import com.rms.repository.AllocationRepository;
import com.rms.repository.EmployeeRepository;
import com.rms.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ForecastService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private AllocationRepository allocationRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    // Simple implementation returning mock-like capacity vs demand by week (next 8 weeks)
    public List<Map<String, Object>> getCapacityForecast() {
        List<Map<String, Object>> forecast = new ArrayList<>();
        LocalDate now = LocalDate.now();

        long totalEmployees = employeeRepository.count();

        // Very basic mock heuristic logic for capacity/demand over next 8 weeks
        // A real implementation would parse project pipelines and allocation end dates
        for (int i = 0; i < 8; i++) {
            Map<String, Object> weekData = new HashMap<>();
            weekData.put("week", "Week " + (i + 1));
            weekData.put("capacity", totalEmployees);
            // Simulate demand based on current pipeline
            long demand = projectRepository.count() * 2 + i; // simplistic heuristic
            weekData.put("demand", demand);
            forecast.add(weekData);
        }

        return forecast;
    }
}
