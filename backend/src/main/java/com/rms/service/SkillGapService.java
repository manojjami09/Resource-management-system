package com.rms.service;

import com.rms.dto.SkillGapDto;
import com.rms.entity.Project;
import com.rms.entity.ProjectStatus;
import com.rms.entity.Skill;
import com.rms.repository.EmployeeRepository;
import com.rms.repository.ProjectRepository;
import com.rms.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    public List<SkillGapDto> getSkillGaps() {
        List<Project> relevantProjects = projectRepository.findAll().stream()
                .filter(p -> p.getStatus() == ProjectStatus.ACTIVE || p.getStatus() == ProjectStatus.PIPELINE)
                .collect(Collectors.toList());

        Map<String, Integer> requiredSkillsCount = new HashMap<>();
        for (Project p : relevantProjects) {
            for (Skill s : p.getRequiredSkills()) {
                requiredSkillsCount.put(s.getName(), requiredSkillsCount.getOrDefault(s.getName(), 0) + 1);
            }
        }

        Map<String, Integer> availableSkillsCount = new HashMap<>();
        employeeRepository.findAll().forEach(e -> {
            for (Skill s : e.getSkills()) {
                availableSkillsCount.put(s.getName(), availableSkillsCount.getOrDefault(s.getName(), 0) + 1);
            }
        });

        return requiredSkillsCount.entrySet().stream()
                .map(entry -> {
                    String skillName = entry.getKey();
                    int required = entry.getValue();
                    int available = availableSkillsCount.getOrDefault(skillName, 0);
                    return new SkillGapDto(skillName, required, available, Math.max(0, required - available));
                })
                .sorted((g1, g2) -> Integer.compare(g2.getGapSeverity(), g1.getGapSeverity()))
                .collect(Collectors.toList());
    }
}
