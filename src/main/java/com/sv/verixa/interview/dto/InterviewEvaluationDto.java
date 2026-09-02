package com.sv.verixa.interview.dto;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewEvaluationDto {
    private UUID interviewId;
    private Integer overallScore;
    private Integer communicationScore;
    private Integer clarityScore;
    private Integer relevanceScore;
    private Integer confidenceScore;
    private Integer professionalismScore;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> improvementSuggestions;
    private String detailedSummary;
}
