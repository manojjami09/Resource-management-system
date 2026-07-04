package com.rms.service;

import com.rms.dto.EmployeeDto;
import com.rms.dto.EmployeeSkillDto;
import com.rms.dto.CurrentAllocationDto;
import com.rms.dto.SkillMatrixDto;
import com.rms.entity.Allocation;
import com.rms.entity.Employee;
import com.rms.entity.EmployeeSkill;
import com.rms.entity.EmployeeStatus;
import com.rms.entity.ProficiencyLevel;
import com.rms.entity.Skill;
import com.rms.repository.AllocationRepository;
import com.rms.repository.EmployeeRepository;
import com.rms.repository.SkillRepository;
import com.rms.repository.UserRepository;
import com.rms.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import com.rms.entity.Role;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AllocationRepository allocationRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private EmployeeDto mapEmployeeToDto(Employee emp) {
        Integer activeAllocPct = allocationRepository.sumActiveAllocationPercentByEmployeeId(emp.getId());
        Integer totalAllocPct = allocationRepository.sumAllocationPercentByEmployeeId(emp.getId());

        if (activeAllocPct != null && activeAllocPct > 0 && emp.getStatus() == EmployeeStatus.BENCH) {
            emp.setStatus(EmployeeStatus.ALLOCATED);
            employeeRepository.save(emp);
        } else if ((activeAllocPct == null || activeAllocPct == 0) && emp.getStatus() == EmployeeStatus.ALLOCATED) {
            emp.setStatus(EmployeeStatus.BENCH);
            employeeRepository.save(emp);
        }

        List<Allocation> allAllocations = allocationRepository.findByEmployeeIdOrderByStartDateDesc(emp.getId());
        List<CurrentAllocationDto> currentAllocs = new ArrayList<>();
        LocalDate availableFrom = null;
        LocalDate maxEndDate = null;

        for (Allocation a : allAllocations) {
            boolean isActive = a.getStartDate().compareTo(LocalDate.now()) <= 0 && a.getEndDate().compareTo(LocalDate.now()) >= 0;
            if (isActive) {
                CurrentAllocationDto cdto = new CurrentAllocationDto();
                cdto.setProjectId(a.getProject().getId());
                cdto.setProjectName(a.getProject().getName());
                cdto.setAllocationPercent(a.getAllocationPercent());
                cdto.setStartDate(a.getStartDate());
                cdto.setEndDate(a.getEndDate());
                currentAllocs.add(cdto);
            }
            if (maxEndDate == null || a.getEndDate().isAfter(maxEndDate)) {
                maxEndDate = a.getEndDate();
            }
        }

        if (activeAllocPct == null || activeAllocPct < 100) {
            availableFrom = null;
        } else {
            availableFrom = maxEndDate != null ? maxEndDate.plusDays(1) : null;
        }

        return MapperUtil.toEmployeeDto(emp, totalAllocPct, activeAllocPct, availableFrom, currentAllocs);
    }

    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream().map(this::mapEmployeeToDto).collect(Collectors.toList());
    }

    public EmployeeDto getEmployeeById(Long id) {
        Employee emp = employeeRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        return mapEmployeeToDto(emp);
    }

    public EmployeeDto getEmployeeByEmail(String email) {
        Employee emp = employeeRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("Employee not found for email: " + email));
        return mapEmployeeToDto(emp);
    }

    public EmployeeDto getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Employee emp = employeeRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No employee profile found for this account"));
        return mapEmployeeToDto(emp);
    }

    @Transactional
    public EmployeeDto createEmployee(EmployeeDto dto) {
        if (dto.getEmail() == null || dto.getEmail().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A user with this email already exists");
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPasswordHash(passwordEncoder.encode("Welcome@123"));
        user.setRole(Role.EMPLOYEE);
        user = userRepository.save(user);

        Employee employee = new Employee();
        updateEmployeeFields(employee, dto);
        if (dto.getStatus() != null) {
            employee.setStatus(EmployeeStatus.valueOf(dto.getStatus()));
        } else {
            employee.setStatus(EmployeeStatus.BENCH);
        }
        employee.setUser(user);
        employee = employeeRepository.save(employee);
        return mapEmployeeToDto(employee);
    }

    public EmployeeDto updateEmployee(Long id, EmployeeDto dto) {
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        updateEmployeeFields(employee, dto);
        if (dto.getStatus() != null) {
            employee.setStatus(EmployeeStatus.valueOf(dto.getStatus()));
        }
        employee = employeeRepository.save(employee);
        return mapEmployeeToDto(employee);
    }

    private void updateEmployeeFields(Employee employee, EmployeeDto dto) {
        employee.setName(dto.getName());
        employee.setEmail(dto.getEmail());
        employee.setJoiningDate(dto.getJoiningDate());
        employee.setDesignation(dto.getDesignation());
        employee.setDepartment(dto.getDepartment());
        employee.setMonthlyCost(dto.getMonthlyCost());

        if (dto.getSkills() != null) {
            // Remove skills that are no longer in the dto
            List<EmployeeSkill> toRemove = new ArrayList<>();
            for (EmployeeSkill es : employee.getEmployeeSkills()) {
                boolean found = false;
                for (EmployeeSkillDto sDto : dto.getSkills()) {
                    if (sDto.getName().equalsIgnoreCase(es.getSkill().getName())) {
                        found = true;
                        es.setProficiencyLevel(sDto.getProficiencyLevel() != null ? ProficiencyLevel.valueOf(sDto.getProficiencyLevel()) : ProficiencyLevel.BEGINNER);
                        break;
                    }
                }
                if (!found) {
                    toRemove.add(es);
                }
            }
            employee.getEmployeeSkills().removeAll(toRemove);

            // Add new skills
            for (EmployeeSkillDto sDto : dto.getSkills()) {
                boolean exists = false;
                for (EmployeeSkill es : employee.getEmployeeSkills()) {
                    if (es.getSkill().getName().equalsIgnoreCase(sDto.getName())) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    Skill skill;
                    if (sDto.getId() != null) {
                        skill = skillRepository.findById(sDto.getId()).orElse(null);
                    } else {
                        skill = skillRepository.findByName(sDto.getName()).orElseGet(() -> {
                            Skill newSkill = new Skill();
                            newSkill.setName(sDto.getName());
                            return skillRepository.save(newSkill);
                        });
                    }
                    if (skill != null) {
                        EmployeeSkill es = new EmployeeSkill();
                        es.setEmployee(employee);
                        es.setSkill(skill);
                        es.setProficiencyLevel(sDto.getProficiencyLevel() != null ? ProficiencyLevel.valueOf(sDto.getProficiencyLevel()) : ProficiencyLevel.BEGINNER);
                        employee.getEmployeeSkills().add(es);
                    }
                }
            }
        }
    }

    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    public List<CurrentAllocationDto> getEmployeeAllocations(Long id) {
        List<Allocation> allAllocations = allocationRepository.findByEmployeeIdOrderByStartDateDesc(id);
        return allAllocations.stream().map(a -> {
            CurrentAllocationDto dto = new CurrentAllocationDto();
            dto.setProjectId(a.getProject().getId());
            dto.setProjectName(a.getProject().getName());
            dto.setAllocationPercent(a.getAllocationPercent());
            dto.setStartDate(a.getStartDate());
            dto.setEndDate(a.getEndDate());
            return dto;
        }).collect(Collectors.toList());
    }

    public List<EmployeeDto> getAvailableEmployees() {
        LocalDate in30Days = LocalDate.now().plusDays(30);
        return employeeRepository.findAll().stream().map(this::mapEmployeeToDto).filter(emp -> 
            emp.getAvailableFrom() == null || emp.getAvailableFrom().isBefore(in30Days) || emp.getAvailableFrom().isEqual(in30Days)
        ).collect(Collectors.toList());
    }

    public SkillMatrixDto getSkillMatrix() {
        List<Employee> allEmps = employeeRepository.findAll();
        List<Skill> allSkills = skillRepository.findAll();

        SkillMatrixDto matrixDto = new SkillMatrixDto();
        
        List<SkillMatrixDto.EmployeeMatrixItem> employeeItems = allEmps.stream().map(e -> {
            SkillMatrixDto.EmployeeMatrixItem ei = new SkillMatrixDto.EmployeeMatrixItem();
            ei.setId(e.getId().toString());
            ei.setName(e.getName());
            return ei;
        }).collect(Collectors.toList());
        matrixDto.setEmployees(employeeItems);

        List<SkillMatrixDto.SkillMatrixItem> skillItems = allSkills.stream().map(s -> {
            SkillMatrixDto.SkillMatrixItem si = new SkillMatrixDto.SkillMatrixItem();
            si.setId(s.getId().toString());
            si.setName(s.getName());
            return si;
        }).collect(Collectors.toList());
        matrixDto.setSkills(skillItems);

        List<List<String>> matrix = new ArrayList<>();
        for (Employee e : allEmps) {
            List<String> row = new ArrayList<>();
            for (Skill s : allSkills) {
                String proficiency = null;
                if (e.getEmployeeSkills() != null) {
                    for (EmployeeSkill es : e.getEmployeeSkills()) {
                        if (es.getSkill().getId().equals(s.getId())) {
                            proficiency = es.getProficiencyLevel().name();
                            break;
                        }
                    }
                }
                row.add(proficiency);
            }
            matrix.add(row);
        }
        matrixDto.setMatrix(matrix);

        return matrixDto;
    }
}

