package com.sv.verixa.progress.dto;

import lombok.*;

import java.time.ZonedDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillDto {
    private UUID id;
    private UUID topicId;
    private String topicName;
    private String category;
    private Double accuracyPercentage;
    private Integer questionsAttempted;
    private Integer questionsSolved;
    private Integer masteryScore;
    private ZonedDateTime updatedAt;
}
