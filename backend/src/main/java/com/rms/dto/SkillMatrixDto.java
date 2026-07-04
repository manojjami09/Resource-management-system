package com.rms.dto;

import lombok.Data;
import java.util.List;

@Data
public class SkillMatrixDto {
    private List<EmployeeMatrixItem> employees;
    private List<SkillMatrixItem> skills;
    private List<List<String>> matrix;

    @Data
    public static class EmployeeMatrixItem {
        private String id;
        private String name;
    }

    @Data
    public static class SkillMatrixItem {
        private String id;
        private String name;
    }
}
