package com.rms.controller;

import com.rms.dto.EmployeeDto;
import com.rms.dto.CurrentAllocationDto;
import com.rms.dto.SkillMatrixDto;
import com.rms.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<EmployeeDto>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/me")
    public ResponseEntity<EmployeeDto> getMyProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(employeeService.getMyProfile(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<EmployeeDto> createEmployee(@RequestBody EmployeeDto employeeDto) {
        return ResponseEntity.ok(employeeService.createEmployee(employeeDto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<EmployeeDto> updateEmployee(@PathVariable Long id, @RequestBody EmployeeDto employeeDto) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, employeeDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/allocations")
    public ResponseEntity<List<CurrentAllocationDto>> getEmployeeAllocations(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeAllocations(id));
    }

    @GetMapping("/available")
    public ResponseEntity<List<EmployeeDto>> getAvailableEmployees() {
        return ResponseEntity.ok(employeeService.getAvailableEmployees());
    }

    @GetMapping("/skill-matrix")
    public ResponseEntity<SkillMatrixDto> getSkillMatrix() {
        return ResponseEntity.ok(employeeService.getSkillMatrix());
    }
}

