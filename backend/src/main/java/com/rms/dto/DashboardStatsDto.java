package com.rms.dto;

import lombok.Data;

@Data
public class DashboardStatsDto {
    private long totalEmployees;
    private double benchPercent;
    private long activeProjects;
    private double avgUtilization;
}
