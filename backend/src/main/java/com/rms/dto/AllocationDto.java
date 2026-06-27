package com.rms.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AllocationDto {
    private Long id;
    private Long employeeId;
    private Long projectId;
    private Integer allocationPercent;
    private LocalDate startDate;
    private LocalDate endDate;
}
