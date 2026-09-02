package com.sv.verixa.resume.dto;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeAnalysisDto {
    private UUID id;
    private UUID resumeId;
    private String fileName;
    private Integer overallMatchScore;
    private List<String> strongSkills;
    private List<String> missingSkills;
    private List<String> weakAreas;
    private List<String> recommendations;
}
