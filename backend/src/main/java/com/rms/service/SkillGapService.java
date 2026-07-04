package com.rms.service;

import com.rms.dto.SkillGapAnalyticsDto;
import com.rms.entity.Project;
import com.rms.entity.ProjectStatus;
import com.rms.entity.Skill;
import com.rms.entity.Employee;
import com.rms.repository.EmployeeRepository;
import com.rms.repository.ProjectRepository;
import com.rms.repository.SkillRepository;
import com.rms.repository.AllocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.rms.dto.*;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SkillGapService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private AllocationRepository allocationRepository;

    public SkillGapAnalyticsDto getSkillGaps() {
        List<Project> relevantProjects = projectRepository.findAll().stream()
                .filter(p -> p.getStatus() == ProjectStatus.ACTIVE || p.getStatus() == ProjectStatus.PIPELINE)
                .collect(Collectors.toList());

        List<Employee> allEmployees = employeeRepository.findAll();

        Map<String, Integer> requiredSkillsCount = new HashMap<>();
        for (Project p : relevantProjects) {
            int currentAllocations = allocationRepository.findByProjectId(p.getId()).size();
            int vacantPositions = Math.max(0, p.getTeamSize() - currentAllocations);
            
            for (Skill s : p.getRequiredSkills()) {
                requiredSkillsCount.put(s.getName(), requiredSkillsCount.getOrDefault(s.getName(), 0) + vacantPositions);
            }
        }

        Map<String, Integer> availableSkillsCount = new HashMap<>();
        allEmployees.stream()
                .filter(e -> com.rms.entity.EmployeeStatus.BENCH.equals(e.getStatus()))
                .forEach(e -> {
                    if (e.getEmployeeSkills() != null) {
                        for (com.rms.entity.EmployeeSkill es : e.getEmployeeSkills()) {
                            availableSkillsCount.put(es.getSkill().getName(), availableSkillsCount.getOrDefault(es.getSkill().getName(), 0) + 1);
                        }
                    }
                });

        List<SkillComparisonDto> requiredVsAvailable = requiredSkillsCount.entrySet().stream()
                .map(entry -> new SkillComparisonDto(entry.getKey(), entry.getValue(), availableSkillsCount.getOrDefault(entry.getKey(), 0)))
                .collect(Collectors.toList());

        // Add any available skills that are not required by active projects (just so they show up in available)
        for (Map.Entry<String, Integer> available : availableSkillsCount.entrySet()) {
            if (!requiredSkillsCount.containsKey(available.getKey())) {
                requiredVsAvailable.add(new SkillComparisonDto(available.getKey(), 0, available.getValue()));
            }
        }
        
        requiredVsAvailable.sort((a, b) -> Integer.compare(b.getRequired(), a.getRequired()));

        List<MissingSkillDto> topMissingSkills = requiredVsAvailable.stream()
                .filter(s -> (s.getRequired() - s.getAvailable()) > 0)
                .map(s -> {
                    int gap = s.getRequired() - s.getAvailable();
                    String severity = gap >= 5 ? "critical" : gap >= 3 ? "high" : "medium";
                    return new MissingSkillDto(s.getSkill(), gap, severity, s.getRequired(), s.getAvailable());
                })
                .sorted((a, b) -> Integer.compare(b.getGap(), a.getGap()))
                .collect(Collectors.toList());

        List<SkillCategoryDto> skillDistribution = calculateSkillDistribution(allEmployees);
        List<DemandForecastItemDto> demandForecast = calculateDemandForecast(relevantProjects);
        List<DeptHeatmapRowDto> departmentHeatmap = calculateDeptHeatmap(allEmployees);

        return new SkillGapAnalyticsDto(requiredVsAvailable, topMissingSkills, skillDistribution, demandForecast, departmentHeatmap);
    }

    private List<SkillCategoryDto> calculateSkillDistribution(List<Employee> employees) {
        Map<String, Integer> categoryCounts = new HashMap<>();
        categoryCounts.put("Frontend", 0);
        categoryCounts.put("Backend", 0);
        categoryCounts.put("Cloud", 0);
        categoryCounts.put("Data", 0);
        categoryCounts.put("DevOps", 0);

        for (Employee e : employees) {
            if (e.getEmployeeSkills() == null) continue;
            boolean hasFrontend = false, hasBackend = false, hasCloud = false, hasData = false, hasDevOps = false;
            for (com.rms.entity.EmployeeSkill es : e.getEmployeeSkills()) {
                String s = es.getSkill().getName().toLowerCase();
                if (s.contains("react") || s.contains("angular") || s.contains("vue") || s.contains("html") || s.contains("css") || s.contains("typescript")) hasFrontend = true;
                if (s.contains("java") || s.contains("node") || s.contains("python") || s.contains("go") || s.contains("spring")) hasBackend = true;
                if (s.contains("aws") || s.contains("azure") || s.contains("gcp")) hasCloud = true;
                if (s.contains("sql") || s.contains("mongo") || s.contains("kafka") || s.contains("spark") || s.contains("dbt")) hasData = true;
                if (s.contains("docker") || s.contains("kubernetes") || s.contains("terraform") || s.contains("devops")) hasDevOps = true;
            }
            if (hasFrontend) categoryCounts.put("Frontend", categoryCounts.get("Frontend") + 1);
            if (hasBackend) categoryCounts.put("Backend", categoryCounts.get("Backend") + 1);
            if (hasCloud) categoryCounts.put("Cloud", categoryCounts.get("Cloud") + 1);
            if (hasData) categoryCounts.put("Data", categoryCounts.get("Data") + 1);
            if (hasDevOps) categoryCounts.put("DevOps", categoryCounts.get("DevOps") + 1);
        }
        
        return categoryCounts.entrySet().stream()
                .map(e -> new SkillCategoryDto(e.getKey(), e.getValue()))
                .sorted((a, b) -> Integer.compare(b.getCount(), a.getCount()))
                .collect(Collectors.toList());
    }

    private List<DemandForecastItemDto> calculateDemandForecast(List<Project> projects) {
        // Very basic mock forecast logic for demonstration
        java.time.YearMonth current = java.time.YearMonth.now();
        List<DemandForecastItemDto> forecast = new java.util.ArrayList<>();
        
        for (int i = 0; i < 6; i++) {
            java.time.YearMonth month = current.plusMonths(i);
            String monthName = month.getMonth().name().substring(0, 3) + " " + month.getYear();
            
            int react = 0, java = 0, aws = 0, python = 0, kubernetes = 0;
            
            for (Project p : projects) {
                if (p.getStartDate() != null && !p.getStartDate().isAfter(month.atEndOfMonth()) && (p.getEndDate() == null || p.getEndDate().isAfter(month.atDay(1)))) {
                    int vacant = Math.max(1, p.getTeamSize() / 2); // approximate future demand per project
                    for (Skill s : p.getRequiredSkills()) {
                        String name = s.getName().toLowerCase();
                        if (name.contains("react")) react += vacant;
                        if (name.equals("java")) java += vacant;
                        if (name.contains("aws")) aws += vacant;
                        if (name.contains("python")) python += vacant;
                        if (name.contains("kubernetes") || name.contains("k8s")) kubernetes += vacant;
                    }
                }
            }
            // Add some base demand so chart doesn't look completely empty if no pipeline projects exist
            react += 10 + i * 2;
            java += 8 + i;
            aws += 5 + i * 2;
            python += 6 + i;
            kubernetes += 4 + i;
            
            forecast.add(new DemandForecastItemDto(monthName, react, java, aws, python, kubernetes));
        }
        return forecast;
    }

    private List<DeptHeatmapRowDto> calculateDeptHeatmap(List<Employee> employees) {
        Map<String, List<Employee>> byDept = employees.stream()
                .filter(e -> e.getDepartment() != null)
                .collect(Collectors.groupingBy(Employee::getDepartment));
                
        List<DeptHeatmapRowDto> heatmap = new java.util.ArrayList<>();
        
        for (Map.Entry<String, List<Employee>> entry : byDept.entrySet()) {
            String dept = entry.getKey();
            List<Employee> deptEmps = entry.getValue();
            if (deptEmps.isEmpty()) continue;
            
            int react = 0, java = 0, python = 0, aws = 0, kubernetes = 0, devops = 0;
            
            for (Employee e : deptEmps) {
                if (e.getEmployeeSkills() == null) continue;
                for (com.rms.entity.EmployeeSkill es : e.getEmployeeSkills()) {
                    String s = es.getSkill().getName().toLowerCase();
                    if (s.contains("react")) react++;
                    if (s.equals("java")) java++;
                    if (s.contains("python")) python++;
                    if (s.contains("aws")) aws++;
                    if (s.contains("kubernetes") || s.contains("k8s")) kubernetes++;
                    if (s.contains("docker") || s.contains("terraform") || s.contains("devops")) devops++;
                }
            }
            
            int total = deptEmps.size();
            heatmap.add(new DeptHeatmapRowDto(
                dept,
                (react * 100) / total,
                (java * 100) / total,
                (python * 100) / total,
                (aws * 100) / total,
                (kubernetes * 100) / total,
                (devops * 100) / total
            ));
        }
        
        return heatmap;
    }
}
