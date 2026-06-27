package com.rms.dto;

import lombok.Data;

import java.util.List;

@Data
public class EmployeeDto {
    private Long id;
    private Long userId;
    private String name;
    private String designation;
    private String status;
    private String department;
    private List<String> skills;
    private Integer allocationPercent;
}
