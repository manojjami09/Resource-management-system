package com.rms.service;

import com.rms.dto.DashboardStatsDto;
import com.rms.entity.ProjectStatus;
import com.rms.repository.AllocationRepository;
import com.rms.repository.EmployeeRepository;
import com.rms.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private AllocationRepository allocationRepository;

    public DashboardStatsDto getStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        long totalEmployees = employeeRepository.count();
        stats.setTotalEmployees(totalEmployees);

        long activeProjects = projectRepository.findAll().stream()
                .filter(p -> p.getStatus() == ProjectStatus.ACTIVE)
                .count();
        stats.setActiveProjects(activeProjects);

        if (totalEmployees == 0) {
            stats.setBenchPercent(0);
            stats.setAvgUtilization(0);
            return stats;
        }

        List<Integer> allocations = employeeRepository.findAll().stream()
                .map(e -> allocationRepository.sumAllocationPercentByEmployeeId(e.getId()))
                .collect(Collectors.toList());

        long onBench = allocations.stream().filter(a -> a == 0).count();
        stats.setBenchPercent((onBench * 100.0) / totalEmployees);

        double totalUtil = allocations.stream().mapToInt(Integer::intValue).sum();
        stats.setAvgUtilization(totalUtil / totalEmployees);

        return stats;
    }
}
