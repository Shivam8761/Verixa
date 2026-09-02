package com.sv.verixa.progress.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressOverviewDto {
    private Integer readinessScore; // null if insufficient data
    private String readinessLabel; // "Not enough data yet" or "Intermediate", "Interview Ready"
    private Integer totalAttempted;
    private Integer totalSolved;
    private Double overallAccuracy;
    private Integer codingSuccessRate;
    private Integer currentStreak;
    private String weakestTopicName;
    private String strongestTopicName;
    private List<SkillDto> skills;
}
