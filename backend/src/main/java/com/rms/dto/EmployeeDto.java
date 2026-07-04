package com.rms.dto;

import lombok.Data;

import java.util.List;
import java.time.LocalDate;

@Data
public class EmployeeDto {
    private Long id;
    private Long userId;
    private String name;
    private String designation;
    private String status;
    private String department;
    private String email;
    private LocalDate joiningDate;
    private Integer experience;
    private Integer totalAllocationPercent;
    private Integer utilizationPercent;
    private LocalDate availableFrom;
    private List<EmployeeSkillDto> skills;
    private List<CurrentAllocationDto> currentAllocations;
    private Double monthlyCost;
}
