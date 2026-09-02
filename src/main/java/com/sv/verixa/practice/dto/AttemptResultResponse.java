package com.sv.verixa.practice.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttemptResultResponse {
    private UUID attemptId;
    private UUID questionId;
    private Boolean isCorrect;
    private Integer score;
    private UUID correctOptionId;
    private String explanation;
    private String solution;
}
