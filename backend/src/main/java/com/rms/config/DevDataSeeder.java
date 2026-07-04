package com.rms.config;

import com.rms.entity.*;
import com.rms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Transactional;

@Component
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
    private ProjectUpdateRepository projectUpdateRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EntityManager entityManager;

    @Transactional
    public void run(String... args) throws Exception {
        // Clear existing data
        allocationRepository.deleteAll();
        projectUpdateRepository.deleteAll();
        projectRepository.deleteAll();
        employeeRepository.deleteAll();
        skillRepository.deleteAll();
        userRepository.deleteAll();
        
        entityManager.flush();
        entityManager.clear();

        // Create Users
        User adminUser = new User();
        adminUser.setEmail("admin@techcorp.com");
        adminUser.setPasswordHash(passwordEncoder.encode("Admin@123"));
        adminUser.setRole(Role.ADMIN);
        userRepository.save(adminUser);

        User managerUser = new User();
        managerUser.setEmail("manager@techcorp.com");
        managerUser.setPasswordHash(passwordEncoder.encode("Manager@123"));
        managerUser.setRole(Role.MANAGER);
        userRepository.save(managerUser);

        User johnUser = new User();
        johnUser.setEmail("john.doe@techcorp.com");
        johnUser.setPasswordHash(passwordEncoder.encode("Employee@123"));
        johnUser.setRole(Role.EMPLOYEE);
        userRepository.save(johnUser);

        User janeUser = new User();
        janeUser.setEmail("jane.smith@techcorp.com");
        janeUser.setPasswordHash(passwordEncoder.encode("Employee@123"));
        janeUser.setRole(Role.EMPLOYEE);
        userRepository.save(janeUser);

        User bobUser = new User();
        bobUser.setEmail("bob.johnson@techcorp.com");
        bobUser.setPasswordHash(passwordEncoder.encode("Employee@123"));
        bobUser.setRole(Role.EMPLOYEE);
        userRepository.save(bobUser);

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
        Employee e1 = new Employee();
        e1.setUser(johnUser);
        e1.setName("John Doe");
        e1.setEmail("john.doe@techcorp.com");
        e1.setJoiningDate(LocalDate.now().minusYears(3));
        e1.setDesignation("Senior Developer");
        e1.setStatus(EmployeeStatus.ALLOCATED);
        e1.setDepartment("Engineering");
        e1.setMonthlyCost(200000.0); // 2 Lakhs
        e1.setEmployeeSkills(new ArrayList<>());
        
        EmployeeSkill es1 = new EmployeeSkill(null, e1, react, ProficiencyLevel.EXPERT);
        EmployeeSkill es2 = new EmployeeSkill(null, e1, nodejs, ProficiencyLevel.INTERMEDIATE);
        e1.getEmployeeSkills().add(es1);
        e1.getEmployeeSkills().add(es2);
        employeeRepository.save(e1);

        Employee e2 = new Employee();
        e2.setUser(janeUser);
        e2.setName("Jane Smith");
        e2.setEmail("jane.smith@techcorp.com");
        e2.setJoiningDate(LocalDate.now().minusYears(2));
        e2.setDesignation("Backend Developer");
        e2.setStatus(EmployeeStatus.ALLOCATED);
        e2.setDepartment("Engineering");
        e2.setMonthlyCost(150000.0); // 1.5 Lakhs
        e2.setEmployeeSkills(new ArrayList<>());

        EmployeeSkill es3 = new EmployeeSkill(null, e2, java, ProficiencyLevel.EXPERT);
        EmployeeSkill es4 = new EmployeeSkill(null, e2, springBoot, ProficiencyLevel.EXPERT);
        e2.getEmployeeSkills().add(es3);
        e2.getEmployeeSkills().add(es4);
        employeeRepository.save(e2);

        Employee e3 = new Employee();
        e3.setUser(bobUser);
        e3.setName("Bob Johnson");
        e3.setEmail("bob.johnson@techcorp.com");
        e3.setJoiningDate(LocalDate.now().minusYears(1));
        e3.setDesignation("Frontend Developer");
        e3.setStatus(EmployeeStatus.BENCH);
        e3.setDepartment("Engineering");
        e3.setMonthlyCost(100000.0); // 1 Lakh
        e3.setEmployeeSkills(new ArrayList<>());

        EmployeeSkill es5 = new EmployeeSkill(null, e3, react, ProficiencyLevel.INTERMEDIATE);
        e3.getEmployeeSkills().add(es5);
        employeeRepository.save(e3);

        User aliceUser = new User();
        aliceUser.setEmail("alice.cooper@techcorp.com");
        aliceUser.setPasswordHash(passwordEncoder.encode("Employee@123"));
        aliceUser.setRole(Role.EMPLOYEE);
        userRepository.save(aliceUser);

        Employee e4 = new Employee();
        e4.setUser(aliceUser);
        e4.setName("Alice Cooper");
        e4.setEmail("alice.cooper@techcorp.com");
        e4.setJoiningDate(LocalDate.now().minusMonths(6));
        e4.setDesignation("DevOps Engineer");
        e4.setStatus(EmployeeStatus.BENCH);
        e4.setDepartment("Operations");
        e4.setMonthlyCost(120000.0);
        e4.setEmployeeSkills(new ArrayList<>());
        e4.getEmployeeSkills().add(new EmployeeSkill(null, e4, react, ProficiencyLevel.BEGINNER)); // Using react as a placeholder skill since AWS/Docker aren't in seeder yet
        employeeRepository.save(e4);

        User charlieUser = new User();
        charlieUser.setEmail("charlie.brown@techcorp.com");
        charlieUser.setPasswordHash(passwordEncoder.encode("Employee@123"));
        charlieUser.setRole(Role.EMPLOYEE);
        userRepository.save(charlieUser);

        Employee e5 = new Employee();
        e5.setUser(charlieUser);
        e5.setName("Charlie Brown");
        e5.setEmail("charlie.brown@techcorp.com");
        e5.setJoiningDate(LocalDate.now().minusYears(4));
        e5.setDesignation("QA Engineer");
        e5.setStatus(EmployeeStatus.BENCH);
        e5.setDepartment("Quality Assurance");
        e5.setMonthlyCost(90000.0);
        e5.setEmployeeSkills(new ArrayList<>());
        e5.getEmployeeSkills().add(new EmployeeSkill(null, e5, java, ProficiencyLevel.INTERMEDIATE));
        employeeRepository.save(e5);

        // Generate 9 more employees to make it exactly 14 employees
        String[] extraNames = {"David Miller", "Emma Wilson", "Frank Thomas", "Grace Taylor", "Henry Moore", "Ivy Anderson", "Jack Jackson", "Karen White", "Leo Harris"};
        String[] extraRoles = {"Backend Developer", "Frontend Developer", "Full Stack Developer", "QA Engineer", "DevOps Engineer", "Data Scientist", "UI/UX Designer", "Product Manager", "Scrum Master"};
        Skill[] extraSkills = {java, react, springBoot, java, nodejs, java, react, nodejs, springBoot};
        
        for (int i = 0; i < 9; i++) {
            String email = extraNames[i].toLowerCase().replace(" ", ".") + "@techcorp.com";
            
            User u = new User();
            u.setEmail(email);
            u.setPasswordHash(passwordEncoder.encode("Employee@123"));
            u.setRole(Role.EMPLOYEE);
            userRepository.save(u);

            Employee emp = new Employee();
            emp.setUser(u);
            emp.setName(extraNames[i]);
            emp.setEmail(email);
            emp.setJoiningDate(LocalDate.now().minusMonths((i + 1) * 3));
            emp.setDesignation(extraRoles[i]);
            emp.setStatus(i % 3 == 0 ? EmployeeStatus.ALLOCATED : EmployeeStatus.BENCH);
            emp.setDepartment(i % 2 == 0 ? "Engineering" : "Operations");
            emp.setMonthlyCost(80000.0 + (i * 10000));
            emp.setEmployeeSkills(new ArrayList<>());
            emp.getEmployeeSkills().add(new EmployeeSkill(null, emp, extraSkills[i], ProficiencyLevel.INTERMEDIATE));
            employeeRepository.save(emp);
        }

        // Create Projects (added budget)
        Project p1 = new Project(null, "E-Commerce Platform", "Acme Corp", LocalDate.now(), LocalDate.now().plusMonths(6), ProjectStatus.ACTIVE, 10, 0, 5000000.0, new HashSet<>(Set.of(react, springBoot)));
        Project p2 = new Project(null, "Mobile App Backend", "Globex", LocalDate.now().plusMonths(1), LocalDate.now().plusMonths(4), ProjectStatus.PIPELINE, 10, 0, 3000000.0, new HashSet<>(Set.of(java, springBoot)));
        Project p3 = new Project(null, "Data Migration Tool", "Techlogix", LocalDate.now().plusMonths(3), LocalDate.now().plusMonths(7), ProjectStatus.PIPELINE, 6, 0, 2000000.0, new HashSet<>(Set.of(java, nodejs)));
        Project p4 = new Project(null, "Customer Portal UI", "Acme Corp", LocalDate.now().plusMonths(5), LocalDate.now().plusMonths(9), ProjectStatus.PIPELINE, 8, 0, 4000000.0, new HashSet<>(Set.of(react, nodejs)));
        
        projectRepository.save(p1);
        projectRepository.save(p2);
        projectRepository.save(p3);
        projectRepository.save(p4);

        // Create Allocations
        Allocation a1 = new Allocation(null, e1, p1, 100, LocalDate.now(), LocalDate.now().plusMonths(6));
        Allocation a2 = new Allocation(null, e2, p1, 100, LocalDate.now(), LocalDate.now().plusMonths(6));
        allocationRepository.save(a1);
        allocationRepository.save(a2);

        // Create Project Updates
        ProjectUpdate pu1 = new ProjectUpdate(null, p1, e1, "Initial project kickoff and requirement gathering completed. Architecture design is in progress.", LocalDateTime.now().minusDays(2));
        projectUpdateRepository.save(pu1);
        
        ProjectUpdate pu2 = new ProjectUpdate(null, p1, e2, "Started working on the database schema for the e-commerce platform. Should be ready for review tomorrow.", LocalDateTime.now().minusDays(1));
        projectUpdateRepository.save(pu2);

        System.out.println("Dev Data Seeded Successfully");
    }
}
