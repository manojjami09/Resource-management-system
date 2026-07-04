package com.rms.service;

import com.rms.dto.ReportDto;
import com.rms.dto.ReportMetricDto;
import com.rms.dto.MissingSkillDto;
import com.rms.entity.Employee;
import com.rms.entity.EmployeeStatus;
import com.rms.entity.Project;
import com.rms.entity.ProjectStatus;
import com.rms.repository.AllocationRepository;
import com.rms.repository.EmployeeRepository;
import com.rms.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReportService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private AllocationRepository allocationRepository;

    @Autowired
    private SkillGapService skillGapService;

    public ReportDto generateUtilizationReport() {
        List<Employee> employees = employeeRepository.findAll();
        Map<String, List<Employee>> byDept = employees.stream()
                .filter(e -> e.getDepartment() != null)
                .collect(Collectors.groupingBy(Employee::getDepartment));

        List<Map<String, Object>> tableData = new ArrayList<>();
        int totalBillable = 0;
        int totalBench = 0;
        int totalUtilSum = 0;
        int totalEmpWithUtil = 0;
        double totalRevenueImpact = 0; // New: calculate from monthly cost

        for (Map.Entry<String, List<Employee>> entry : byDept.entrySet()) {
            String dept = entry.getKey();
            List<Employee> deptEmps = entry.getValue();
            int headcount = deptEmps.size();
            int billable = 0;
            int bench = 0;
            int deptUtilSum = 0;

            for (Employee e : deptEmps) {
                if (EmployeeStatus.BENCH.equals(e.getStatus())) {
                    bench++;
                } else {
                    // For simplicity, any non-bench is billable
                    billable++;
                    // Mock utilization between 70% and 100% for active employees
                    int mockUtil = 70 + (Math.abs(e.getId().hashCode()) % 31);
                    deptUtilSum += mockUtil;
                    totalUtilSum += mockUtil;
                    totalEmpWithUtil++;
                    
                    if (e.getMonthlyCost() != null) {
                        totalRevenueImpact += e.getMonthlyCost() * 2.0; // 2x multiplier
                    }
                }
            }

            totalBillable += billable;
            totalBench += bench;
            int avgUtil = billable > 0 ? deptUtilSum / billable : 0;

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("Department", dept);
            row.put("Headcount", headcount);
            row.put("Avg Utilization", avgUtil + "%");
            row.put("Billable", billable);
            row.put("Bench", bench);
            tableData.add(row);
        }

        int orgAvgUtil = totalEmpWithUtil > 0 ? totalUtilSum / totalEmpWithUtil : 0;
        String formattedRevenue = String.format("₹%.2fCr", totalRevenueImpact / 10000000.0);

        List<ReportMetricDto> metrics = Arrays.asList(
                new ReportMetricDto("Avg Utilization", orgAvgUtil + "%", "+2% vs Last Month"),
                new ReportMetricDto("Billable Resources", totalBillable, "+5 vs Last Month"),
                new ReportMetricDto("Bench Count", totalBench, "-1 vs Last Month"),
                new ReportMetricDto("Revenue Impact", formattedRevenue, "+4.1%")
        );

        return new ReportDto(
                "rep-utilization",
                "Monthly Utilization Report",
                "Comprehensive utilization analysis across all departments and resource pools.",
                LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME),
                metrics,
                Arrays.asList("Department", "Headcount", "Avg Utilization", "Billable", "Bench"),
                tableData
        );
    }

    public ReportDto generateProjectSummaryReport() {
        List<Project> projects = projectRepository.findAll();
        List<Map<String, Object>> tableData = new ArrayList<>();

        int activeCount = 0;
        int onTrackCount = 0;
        int atRiskCount = 0;
        int onHoldCount = 0;

        for (Project p : projects) {
            String statusStr = p.getStatus().name();
            if (p.getStatus() == ProjectStatus.ACTIVE) activeCount++;
            if (p.getStatus() == ProjectStatus.COMPLETED) continue; // Skip completed? Actually show them if we want, or skip.

            String health = "Green";
            int comp = p.getCompletionPercentage() != null ? p.getCompletionPercentage() : 0;
            
            // Mock logic for health
            if (p.getStatus() == ProjectStatus.PIPELINE) {
                health = "Yellow";
            } else if (comp < 20 && p.getStartDate() != null && ChronoUnit.DAYS.between(p.getStartDate(), LocalDate.now()) > 30) {
                health = "Yellow";
                atRiskCount++;
            } else if (comp < 50 && p.getStartDate() != null && ChronoUnit.DAYS.between(p.getStartDate(), LocalDate.now()) > 90) {
                health = "Red";
                atRiskCount++;
            } else {
                if (p.getStatus() == ProjectStatus.ACTIVE) onTrackCount++;
            }

            double totalSpent = 0;
            List<com.rms.entity.Allocation> allocations = allocationRepository.findByProjectId(p.getId());
            for (com.rms.entity.Allocation a : allocations) {
                if (a.getEmployee() != null && a.getEmployee().getMonthlyCost() != null && a.getStartDate() != null) {
                    LocalDate endCalc = a.getEndDate() != null && a.getEndDate().isBefore(LocalDate.now()) ? a.getEndDate() : LocalDate.now();
                    long daysWorked = ChronoUnit.DAYS.between(a.getStartDate(), endCalc);
                    if (daysWorked > 0) {
                        double dailyCost = a.getEmployee().getMonthlyCost() / 30.0;
                        double costForAllocation = dailyCost * daysWorked * (a.getAllocationPercent() / 100.0);
                        totalSpent += costForAllocation;
                    }
                }
            }
            
            int budgetBurn = 0;
            if (p.getBudget() != null && p.getBudget() > 0) {
                budgetBurn = (int) Math.min(100, Math.round((totalSpent / p.getBudget()) * 100));
            } else {
                budgetBurn = Math.min(100, comp + (Math.abs(p.getId().hashCode()) % 15)); // fallback
            }

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("Project", p.getName());
            row.put("Client", p.getClient() != null ? p.getClient() : "Internal");
            row.put("Status", statusStr);
            row.put("Health", health);
            row.put("Completion", comp + "%");
            row.put("Budget Burn", budgetBurn + "%");
            tableData.add(row);
        }

        List<ReportMetricDto> metrics = Arrays.asList(
                new ReportMetricDto("Active Projects", activeCount, null),
                new ReportMetricDto("On Track", onTrackCount, null),
                new ReportMetricDto("At Risk", atRiskCount, null),
                new ReportMetricDto("On Hold", onHoldCount, null)
        );

        return new ReportDto(
                "rep-project",
                "Project Summary Report",
                "Status and health overview of all projects.",
                LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME),
                metrics,
                Arrays.asList("Project", "Client", "Status", "Health", "Completion", "Budget Burn"),
                tableData
        );
    }

    public ReportDto generateBenchReport() {
        List<Employee> benchEmployees = employeeRepository.findAll().stream()
                .filter(e -> EmployeeStatus.BENCH.equals(e.getStatus()))
                .collect(Collectors.toList());

        List<Map<String, Object>> tableData = new ArrayList<>();
        long totalBenchDays = 0;
        double totalBenchCost = 0;

        for (Employee e : benchEmployees) {
            String skills = "";
            if (e.getEmployeeSkills() != null) {
                skills = e.getEmployeeSkills().stream()
                        .map(es -> es.getSkill().getName())
                        .collect(Collectors.joining(", "));
            }

            long daysOnBench = ChronoUnit.DAYS.between(e.getJoiningDate(), LocalDate.now());
            if (daysOnBench < 0) daysOnBench = 0;
            totalBenchDays += daysOnBench;
            
            if (e.getMonthlyCost() != null) {
                totalBenchCost += e.getMonthlyCost();
            }

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("Employee", e.getName());
            row.put("Designation", e.getDesignation());
            row.put("Department", e.getDepartment());
            row.put("Skills", skills);
            row.put("Days on Bench", daysOnBench);
            row.put("Last Project", "N/A"); // simplified for mock
            tableData.add(row);
        }

        long avgBenchDays = benchEmployees.isEmpty() ? 0 : totalBenchDays / benchEmployees.size();
        int totalBench = benchEmployees.size();
        long totalEmps = employeeRepository.count();
        int benchPercent = totalEmps > 0 ? (int) ((totalBench * 100.0) / totalEmps) : 0;
        
        String formattedBenchCost = String.format("₹%.2fL", totalBenchCost / 100000.0);

        List<ReportMetricDto> metrics = Arrays.asList(
                new ReportMetricDto("Total Bench", totalBench, null),
                new ReportMetricDto("Bench %", benchPercent + "%", null),
                new ReportMetricDto("Bench Cost (Monthly)", formattedBenchCost, null),
                new ReportMetricDto("Avg Days on Bench", avgBenchDays, null)
        );

        return new ReportDto(
                "rep-bench",
                "Bench Resource Report",
                "Detailed analysis of unallocated resources and bench aging.",
                LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME),
                metrics,
                Arrays.asList("Employee", "Designation", "Department", "Skills", "Days on Bench", "Last Project"),
                tableData
        );
    }

    public ReportDto generateForecastReport() {
        List<MissingSkillDto> missingSkills = skillGapService.getSkillGaps().getTopMissingSkills();
        
        List<Map<String, Object>> tableData = new ArrayList<>();
        int totalDemand = 0;
        int totalGap = 0;
        int criticalRoles = 0;
        
        for (MissingSkillDto ms : missingSkills) {
            totalDemand += ms.getRequired();
            totalGap += ms.getGap();
            if ("critical".equalsIgnoreCase(ms.getSeverity())) {
                criticalRoles++;
            }
            
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("Role", ms.getSkill() + " Specialist");
            row.put("Q3 Demand", ms.getRequired());
            row.put("Current Supply", ms.getAvailable());
            row.put("Gap", ms.getGap());
            // Capitalize first letter
            String severity = ms.getSeverity();
            if (severity != null && !severity.isEmpty()) {
                severity = severity.substring(0, 1).toUpperCase() + severity.substring(1);
            }
            row.put("Urgency", severity);
            tableData.add(row);
        }
        
        int recommendedHiring = (int) (totalGap * 0.8);

        List<ReportMetricDto> metrics = Arrays.asList(
                new ReportMetricDto("Expected Demand", totalDemand, null),
                new ReportMetricDto("Supply Gap", totalGap, null),
                new ReportMetricDto("Critical Roles", criticalRoles, null),
                new ReportMetricDto("Hiring Recommended", recommendedHiring, null)
        );

        return new ReportDto(
                "rep-forecast",
                "Resource Demand Forecast",
                "Projected resource demand and skill requirements.",
                LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME),
                metrics,
                Arrays.asList("Role", "Q3 Demand", "Current Supply", "Gap", "Urgency"),
                tableData
        );
    }
}
