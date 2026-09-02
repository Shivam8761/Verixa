package com.sv.verixa.practice.dto;

import com.sv.verixa.question.dto.QuestionDto;
import lombok.*;

import java.time.ZonedDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MistakeDto {
    private QuestionDto question;
    private int totalAttempts;
    private boolean lastResult;
    private boolean isMastered;
    private ZonedDateTime lastAttemptedAt;
}
