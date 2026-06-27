package com.rms.controller;

import com.rms.dto.RecommendationDto;
import com.rms.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping
    public ResponseEntity<List<RecommendationDto>> getRecommendations(@RequestParam Long projectId) {
        return ResponseEntity.ok(recommendationService.getRecommendationsForProject(projectId));
    }
}
