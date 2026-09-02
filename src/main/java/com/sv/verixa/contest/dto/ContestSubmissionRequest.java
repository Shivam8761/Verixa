package com.sv.verixa.contest.dto;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContestSubmissionRequest {

    private List<SingleSubmission> submissions;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SingleSubmission {
        private UUID questionId;
        private String answer;
        private UUID selectedOptionId;
    }
}
