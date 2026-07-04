package com.rms.controller;

import com.rms.dto.ProjectDto;
import com.rms.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import com.rms.dto.ProjectUpdateDto;
import com.rms.dto.EmployeeDto;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/my-projects")
    public ResponseEntity<List<ProjectDto>> getMyProjects() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(projectService.getMyProjects(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }
    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@RequestBody ProjectDto projectDto) {
        return ResponseEntity.ok(projectService.createProject(projectDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDto> updateProject(@PathVariable Long id, @RequestBody ProjectDto projectDto) {
        return ResponseEntity.ok(projectService.updateProject(id, projectDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/updates")
    public ResponseEntity<List<ProjectUpdateDto>> getProjectUpdates(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectUpdates(id));
    }

    @PostMapping("/{id}/updates")
    public ResponseEntity<ProjectUpdateDto> postProjectUpdate(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(projectService.postProjectUpdate(id, payload.get("content"), email));
    }

    @PutMapping("/{id}/completion")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ProjectDto> updateProjectCompletion(@PathVariable Long id, @RequestBody Map<String, Integer> payload) {
        return ResponseEntity.ok(projectService.updateProjectCompletion(id, payload.get("percentage")));
    }

    @GetMapping("/{id}/team")
    public ResponseEntity<List<EmployeeDto>> getProjectTeam(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectTeam(id));
    }
}

