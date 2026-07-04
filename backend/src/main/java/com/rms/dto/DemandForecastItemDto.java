package com.rms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DemandForecastItemDto {
    private String month;
    private int react;
    private int java;
    private int aws;
    private int python;
    private int kubernetes;
}
