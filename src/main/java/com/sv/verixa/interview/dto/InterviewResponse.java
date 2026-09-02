package com.sv.verixa.interview.dto;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewResponse {
    private UUID interviewId;
    private String nextQuestionText;
    private String feedbackOnLastAnswer;
    private Integer communicationScore;
    private Integer relevanceScore;
    private Integer confidenceScore;
    private Boolean isCompleted;
    private InterviewEvaluationDto finalEvaluation;
}
