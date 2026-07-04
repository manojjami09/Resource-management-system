package com.rms.controller;

import com.rms.dto.SkillGapAnalyticsDto;
import com.rms.service.SkillGapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    @Autowired
    private SkillGapService skillGapService;

    @GetMapping("/gap-analysis")
    public ResponseEntity<SkillGapAnalyticsDto> getSkillGapAnalysis() {
        return ResponseEntity.ok(skillGapService.getSkillGaps());
    }
}
