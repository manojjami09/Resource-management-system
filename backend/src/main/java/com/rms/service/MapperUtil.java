package com.rms.service;

import com.rms.dto.AllocationDto;
import com.rms.dto.EmployeeDto;
import com.rms.dto.ProjectDto;
import com.rms.entity.Allocation;
import com.rms.entity.Employee;
import com.rms.entity.Project;
import com.rms.entity.Skill;

import com.rms.dto.CurrentAllocationDto;
import com.rms.dto.EmployeeSkillDto;
import com.rms.dto.ProjectUpdateDto;
import com.rms.entity.EmployeeSkill;
import com.rms.entity.ProjectUpdate;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class MapperUtil {

    public static EmployeeDto toEmployeeDto(Employee employee) {
        return toEmployeeDto(employee, 0, 0, null, new java.util.ArrayList<>());
    }

    public static EmployeeDto toEmployeeDto(Employee employee, Integer totalAllocationPercent, Integer utilizationPercent, LocalDate availableFrom, List<CurrentAllocationDto> currentAllocations) {
        EmployeeDto dto = new EmployeeDto();
        dto.setId(employee.getId());
        dto.setUserId(employee.getUser() != null ? employee.getUser().getId() : null);
        dto.setName(employee.getName());
        dto.setEmail(employee.getEmail());
        dto.setJoiningDate(employee.getJoiningDate());
        if (employee.getJoiningDate() != null) {
            dto.setExperience(LocalDate.now().getYear() - employee.getJoiningDate().getYear());
        } else {
            dto.setExperience(0);
        }
        dto.setDesignation(employee.getDesignation());
        dto.setStatus(employee.getStatus() != null ? employee.getStatus().name() : null);
        dto.setDepartment(employee.getDepartment());
        
        if (employee.getEmployeeSkills() != null) {
            dto.setSkills(employee.getEmployeeSkills().stream().map(es -> {
                EmployeeSkillDto sDto = new EmployeeSkillDto();
                sDto.setId(es.getSkill().getId());
                sDto.setName(es.getSkill().getName());
                if (es.getProficiencyLevel() != null) {
                    sDto.setProficiencyLevel(es.getProficiencyLevel().name());
                }
                return sDto;
            }).collect(Collectors.toList()));
        }
        dto.setTotalAllocationPercent(totalAllocationPercent != null ? totalAllocationPercent : 0);
        dto.setUtilizationPercent(utilizationPercent != null ? utilizationPercent : 0);
        dto.setAvailableFrom(availableFrom);
        dto.setCurrentAllocations(currentAllocations);
        dto.setMonthlyCost(employee.getMonthlyCost());
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
        dto.setTeamSize(project.getTeamSize());
        dto.setCompletionPercentage(project.getCompletionPercentage() != null ? project.getCompletionPercentage() : 0);
        if (project.getRequiredSkills() != null) {
            dto.setRequiredSkills(
                project.getRequiredSkills().stream().map(s -> s.getName()).collect(Collectors.toList())
            );
        }
        dto.setBudget(project.getBudget());
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

    public static ProjectUpdateDto toProjectUpdateDto(ProjectUpdate update) {
        ProjectUpdateDto dto = new ProjectUpdateDto();
        dto.setId(update.getId());
        dto.setProjectId(update.getProject().getId());
        dto.setAuthorName(update.getAuthor().getName());
        dto.setContent(update.getContent());
        dto.setCreatedAt(update.getCreatedAt());
        return dto;
    }
}
