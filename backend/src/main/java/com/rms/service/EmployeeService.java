package com.rms.service;

import com.rms.dto.EmployeeDto;
import com.rms.entity.Employee;
import com.rms.repository.AllocationRepository;
import com.rms.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AllocationRepository allocationRepository;

    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream().map(emp -> {
            Integer allocPct = allocationRepository.sumAllocationPercentByEmployeeId(emp.getId());
            return MapperUtil.toEmployeeDto(emp, allocPct);
        }).collect(Collectors.toList());
    }

    public EmployeeDto getEmployeeById(Long id) {
        Employee emp = employeeRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        Integer allocPct = allocationRepository.sumAllocationPercentByEmployeeId(emp.getId());
        return MapperUtil.toEmployeeDto(emp, allocPct);
    }
}
