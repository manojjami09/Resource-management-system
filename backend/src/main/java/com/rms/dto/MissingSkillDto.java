package com.rms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MissingSkillDto {
    private String skill;
    private int gap;
    private String severity;
    private int required;
    private int available;
}
