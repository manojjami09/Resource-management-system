package com.rms.service;

import com.rms.dto.ProjectDto;
import com.rms.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Set;
import java.util.HashSet;
import com.rms.entity.Project;
import com.rms.entity.ProjectStatus;
import com.rms.entity.Skill;
import com.rms.repository.SkillRepository;
import com.rms.repository.UserRepository;
import com.rms.repository.AllocationRepository;
import com.rms.repository.ProjectUpdateRepository;
import com.rms.repository.EmployeeRepository;
import com.rms.entity.User;
import com.rms.entity.Employee;
import com.rms.entity.ProjectUpdate;
import com.rms.dto.ProjectUpdateDto;
import com.rms.dto.EmployeeDto;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private AllocationRepository allocationRepository;

    @Autowired
    private ProjectUpdateRepository projectUpdateRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream().map(MapperUtil::toProjectDto).collect(Collectors.toList());
    }

    public List<ProjectDto> getMyProjects(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return projectRepository.findActiveProjectsByUserId(user.getId()).stream()
                .map(MapperUtil::toProjectDto)
                .collect(Collectors.toList());
    }

    public ProjectDto getProjectById(Long id) {
        return MapperUtil.toProjectDto(projectRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Project not found")));
    }

    public ProjectDto updateProject(Long id, ProjectDto dto) {
        Project project = projectRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Project not found"));
        project.setName(dto.getName());
        project.setClient(dto.getClient());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        if (dto.getStatus() != null) {
            project.setStatus(ProjectStatus.valueOf(dto.getStatus().toUpperCase()));
        }
        if (dto.getTeamSize() != null) {
            project.setTeamSize(dto.getTeamSize());
        }
        if (dto.getBudget() != null) {
            project.setBudget(dto.getBudget());
        }

        Set<Skill> projectSkills = new HashSet<>();
        if (dto.getRequiredSkills() != null) {
            for (String skillName : dto.getRequiredSkills()) {
                Skill skill = skillRepository.findByName(skillName).orElseGet(() -> {
                    Skill newSkill = new Skill();
                    newSkill.setName(skillName);
                    return skillRepository.save(newSkill);
                });
                projectSkills.add(skill);
            }
        }
        project.setRequiredSkills(projectSkills);

        return MapperUtil.toProjectDto(projectRepository.save(project));
    }

    public void deleteProject(Long id) {
        allocationRepository.deleteByProjectId(id);
        projectRepository.deleteById(id);
    }

    public ProjectDto createProject(ProjectDto dto) {
        Project project = new Project();
        project.setName(dto.getName());
        project.setClient(dto.getClient());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        project.setStatus(ProjectStatus.ACTIVE);
        project.setTeamSize(dto.getTeamSize() != null ? dto.getTeamSize() : 5);
        if (dto.getBudget() != null) {
            project.setBudget(dto.getBudget());
        }

        Set<Skill> projectSkills = new HashSet<>();
        if (dto.getRequiredSkills() != null) {
            for (String skillName : dto.getRequiredSkills()) {
                Skill skill = skillRepository.findByName(skillName).orElseGet(() -> {
                    Skill newSkill = new Skill();
                    newSkill.setName(skillName);
                    return skillRepository.save(newSkill);
                });
                projectSkills.add(skill);
            }
        }
        project.setRequiredSkills(projectSkills);
        project = projectRepository.save(project);
        return MapperUtil.toProjectDto(project);
    }

    public List<ProjectUpdateDto> getProjectUpdates(Long projectId) {
        return projectUpdateRepository.findByProjectIdOrderByCreatedAtDesc(projectId)
                .stream()
                .map(MapperUtil::toProjectUpdateDto)
                .collect(Collectors.toList());
    }

    public ProjectUpdateDto postProjectUpdate(Long projectId, String content, String email) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        
        Employee author = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));

        ProjectUpdate update = new ProjectUpdate();
        update.setProject(project);
        update.setAuthor(author);
        update.setContent(content);

        update = projectUpdateRepository.save(update);
        return MapperUtil.toProjectUpdateDto(update);
    }

    public ProjectDto updateProjectCompletion(Long id, Integer percentage) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        project.setCompletionPercentage(percentage);
        return MapperUtil.toProjectDto(projectRepository.save(project));
    }

    public List<EmployeeDto> getProjectTeam(Long projectId) {
        return allocationRepository.findByProjectId(projectId)
                .stream()
                .map(alloc -> MapperUtil.toEmployeeDto(alloc.getEmployee()))
                .collect(Collectors.toList());
    }
}

