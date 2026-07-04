package com.rms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeptHeatmapRowDto {
    private String dept;
    private int react;
    private int java;
    private int python;
    private int aws;
    private int kubernetes;
    private int devops;
}
