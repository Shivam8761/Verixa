package com.sv.verixa.leaderboard.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderboardDto {
    private UUID id;
    private UUID contestId;
    private UUID userId;
    private String userFullName;
    private String userEmail;
    private Integer rank;
    private Integer score;
    private Double accuracy;
    private Integer totalTimeSeconds;
}
