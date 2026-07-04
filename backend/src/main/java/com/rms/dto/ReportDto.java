package com.rms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportDto {
    private String id;
    private String title;
    private String description;
    private String lastGenerated;
    private List<ReportMetricDto> metrics;
    private List<String> tableColumns;
    private List<Map<String, Object>> tableData;
}
