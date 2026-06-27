package com.rms.config;

import com.rms.entity.*;
import com.rms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Component
@Profile("dev")
public class DevDataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private AllocationRepository allocationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Create Admin Demo User
            if (userRepository.findByEmail("admin@demo.com").isEmpty()) {
                User adminDemo = new User();
                adminDemo.setEmail("admin@demo.com");
                adminDemo.setPasswordHash(passwordEncoder.encode("Demo@123"));
                adminDemo.setRole(Role.ADMIN);
                userRepository.save(adminDemo);
            }
            
            // Create Manager Demo User
            if (userRepository.findByEmail("manager@demo.com").isEmpty()) {
                User managerDemo = new User();
                managerDemo.setEmail("manager@demo.com");
                managerDemo.setPasswordHash(passwordEncoder.encode("Demo@123"));
                managerDemo.setRole(Role.MANAGER);
                userRepository.save(managerDemo);
            }
            
            // Create Employee Demo User
            if (userRepository.findByEmail("employee@demo.com").isEmpty()) {
                User employeeDemo = new User();
                employeeDemo.setEmail("employee@demo.com");
                employeeDemo.setPasswordHash(passwordEncoder.encode("Demo@123"));
                employeeDemo.setRole(Role.EMPLOYEE);
                userRepository.save(employeeDemo);
            }

            // Create Original Admin User (keeping original just in case)
            if (userRepository.findByEmail("admin@example.com").isEmpty()) {
                User admin = new User();
                admin.setEmail("admin@example.com");
                admin.setPasswordHash(passwordEncoder.encode("admin"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
            }

            // Create Skills
            Skill react = new Skill(null, "React");
            Skill java = new Skill(null, "Java");
            Skill springBoot = new Skill(null, "Spring Boot");
            Skill nodejs = new Skill(null, "Node.js");
            skillRepository.save(react);
            skillRepository.save(java);
            skillRepository.save(springBoot);
            skillRepository.save(nodejs);

            // Create Employees
            User admin = userRepository.findByEmail("admin@example.com").orElse(null);
            Employee e1 = new Employee(null, admin, "John Doe", "Senior Developer", EmployeeStatus.ALLOCATED, "Engineering", new HashSet<>(Set.of(react, nodejs)));
            Employee e2 = new Employee(null, null, "Jane Smith", "Backend Developer", EmployeeStatus.ALLOCATED, "Engineering", new HashSet<>(Set.of(java, springBoot)));
            Employee e3 = new Employee(null, null, "Bob Johnson", "Frontend Developer", EmployeeStatus.BENCH, "Engineering", new HashSet<>(Set.of(react)));
            employeeRepository.save(e1);
            employeeRepository.save(e2);
            employeeRepository.save(e3);

            // Create Projects
            Project p1 = new Project(null, "E-Commerce Platform", "Acme Corp", LocalDate.now(), LocalDate.now().plusMonths(6), ProjectStatus.ACTIVE, new HashSet<>(Set.of(react, springBoot)));
            Project p2 = new Project(null, "Mobile App Backend", "Globex", LocalDate.now().plusMonths(1), LocalDate.now().plusMonths(4), ProjectStatus.PIPELINE, new HashSet<>(Set.of(java, springBoot)));
            projectRepository.save(p1);
            projectRepository.save(p2);

            // Create Allocations
            Allocation a1 = new Allocation(null, e1, p1, 50, LocalDate.now(), LocalDate.now().plusMonths(6));
            Allocation a2 = new Allocation(null, e2, p1, 100, LocalDate.now(), LocalDate.now().plusMonths(6));
            allocationRepository.save(a1);
            allocationRepository.save(a2);

            System.out.println("Dev Data Seeded Successfully");
        }
    }
}
