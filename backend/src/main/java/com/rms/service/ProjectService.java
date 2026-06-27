package com.rms.service;

import com.rms.dto.ProjectDto;
import com.rms.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream().map(MapperUtil::toProjectDto).collect(Collectors.toList());
    }

    public ProjectDto getProjectById(Long id) {
        return MapperUtil.toProjectDto(projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found")));
    }
}
