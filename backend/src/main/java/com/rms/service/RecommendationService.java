package com.rms.service;

import com.rms.dto.RecommendationDto;
import com.rms.entity.Employee;
import com.rms.entity.Project;
import com.rms.entity.Skill;
import com.rms.repository.AllocationRepository;
import com.rms.repository.EmployeeRepository;
import com.rms.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private AllocationRepository allocationRepository;

    public List<RecommendationDto> getRecommendationsForProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        Set<Skill> requiredSkills = project.getRequiredSkills();
        List<Employee> allEmployees = employeeRepository.findAll();
        List<RecommendationDto> recommendations = new ArrayList<>();

        for (Employee emp : allEmployees) {
            int allocPct = allocationRepository.sumAllocationPercentByEmployeeId(emp.getId());
            double availabilityScore = 100.0 - allocPct;

            Set<Skill> empSkills = emp.getSkills();
            long overlap = requiredSkills.stream().filter(empSkills::contains).count();
            double jaccard = 0.0;
            if (!requiredSkills.isEmpty() || !empSkills.isEmpty()) {
                long unionSize = requiredSkills.size() + empSkills.size() - overlap;
                jaccard = (double) overlap / unionSize;
            }

            double skillScore = jaccard * 100.0;
            double matchScore = (skillScore * 0.7) + (availabilityScore * 0.3); // weighted scoring

            if (matchScore > 0) {
                String reasoning = String.format("Matches %d required skills. Availability is %.1f%%.", overlap, availabilityScore);
                recommendations.add(new RecommendationDto(MapperUtil.toEmployeeDto(emp, allocPct), matchScore, reasoning));
            }
        }

        recommendations.sort((r1, r2) -> Double.compare(r2.getMatchScore(), r1.getMatchScore()));
        return recommendations;
    }
}
