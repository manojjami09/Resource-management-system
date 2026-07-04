package com.rms.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ProjectUpdateDto {
    private Long id;
    private Long projectId;
    private String authorName;
    private String content;
    private LocalDateTime createdAt;
}
