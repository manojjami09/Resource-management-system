package com.rms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SkillGapAnalyticsDto {
    private List<SkillComparisonDto> requiredVsAvailable;
    private List<MissingSkillDto> topMissingSkills;
    private List<SkillCategoryDto> skillDistribution;
    private List<DemandForecastItemDto> demandForecast;
    private List<DeptHeatmapRowDto> departmentHeatmap;
}
