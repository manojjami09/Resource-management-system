package com.rms.service;

import com.rms.dto.AllocationDto;
import com.rms.entity.Allocation;
import com.rms.entity.Employee;
import com.rms.entity.Project;
import com.rms.entity.ProjectStatus;
import com.rms.entity.EmployeeStatus;
import com.rms.repository.AllocationRepository;
import com.rms.repository.EmployeeRepository;
import com.rms.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AllocationService {

    @Autowired
    private AllocationRepository allocationRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public List<AllocationDto> getAllAllocations() {
        return allocationRepository.findAll().stream().map(MapperUtil::toAllocationDto).collect(Collectors.toList());
    }

    public AllocationDto createAllocation(AllocationDto dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        Integer currentAlloc = allocationRepository.sumAllocationPercentByEmployeeId(employee.getId());
        if (currentAlloc + dto.getAllocationPercent() > 100) {
            throw new IllegalArgumentException("Overallocation: Employee total allocation cannot exceed 100%");
        }

        Allocation allocation = new Allocation();
        allocation.setEmployee(employee);
        allocation.setProject(project);
        allocation.setAllocationPercent(dto.getAllocationPercent());
        allocation.setStartDate(dto.getStartDate());
        allocation.setEndDate(dto.getEndDate());

        if (currentAlloc + dto.getAllocationPercent() > 0) {
            employee.setStatus(EmployeeStatus.ALLOCATED);
            employeeRepository.save(employee);
        }

        if (project.getStatus() == ProjectStatus.PIPELINE) {
            project.setStatus(ProjectStatus.ACTIVE);
            projectRepository.save(project);
        }

        Allocation saved = allocationRepository.save(allocation);
        return MapperUtil.toAllocationDto(saved);
    }
}

