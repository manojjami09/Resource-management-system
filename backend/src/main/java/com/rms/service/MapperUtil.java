package com.rms.service;

import com.rms.dto.AllocationDto;
import com.rms.dto.EmployeeDto;
import com.rms.dto.ProjectDto;
import com.rms.entity.Allocation;
import com.rms.entity.Employee;
import com.rms.entity.Project;
import com.rms.entity.Skill;

import java.util.stream.Collectors;

public class MapperUtil {

    public static EmployeeDto toEmployeeDto(Employee employee, Integer allocationPercent) {
        EmployeeDto dto = new EmployeeDto();
        dto.setId(employee.getId());
        dto.setUserId(employee.getUser() != null ? employee.getUser().getId() : null);
        dto.setName(employee.getName());
        dto.setDesignation(employee.getDesignation());
        dto.setStatus(employee.getStatus().name());
        dto.setDepartment(employee.getDepartment());
        if (employee.getSkills() != null) {
            dto.setSkills(employee.getSkills().stream().map(Skill::getName).collect(Collectors.toList()));
        }
        dto.setAllocationPercent(allocationPercent);
        return dto;
    }

    public static ProjectDto toProjectDto(Project project) {
        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setClient(project.getClient());
        dto.setStartDate(project.getStartDate());
        dto.setEndDate(project.getEndDate());
        dto.setStatus(project.getStatus().name());
        if (project.getRequiredSkills() != null) {
            dto.setRequiredSkills(project.getRequiredSkills().stream().map(Skill::getName).collect(Collectors.toList()));
        }
        return dto;
    }

    public static AllocationDto toAllocationDto(Allocation allocation) {
        AllocationDto dto = new AllocationDto();
        dto.setId(allocation.getId());
        dto.setEmployeeId(allocation.getEmployee().getId());
        dto.setProjectId(allocation.getProject().getId());
        dto.setAllocationPercent(allocation.getAllocationPercent());
        dto.setStartDate(allocation.getStartDate());
        dto.setEndDate(allocation.getEndDate());
        return dto;
    }
}
