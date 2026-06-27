package com.rms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SkillGapDto {
    private String skill;
    private int requiredCount;
    private int availableCount;
    private int gapSeverity; // could be requiredCount - availableCount
}
