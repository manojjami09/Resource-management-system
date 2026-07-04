package com.rms.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CurrentAllocationDto {
    private Long projectId;
    private String projectName;
    private Integer allocationPercent;
    private LocalDate startDate;
    private LocalDate endDate;
}
