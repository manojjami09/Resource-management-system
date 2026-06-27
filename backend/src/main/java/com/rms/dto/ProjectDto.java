package com.rms.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ProjectDto {
    private Long id;
    private String name;
    private String client;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private List<String> requiredSkills;
}
