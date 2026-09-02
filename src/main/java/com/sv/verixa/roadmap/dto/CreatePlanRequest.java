package com.sv.verixa.roadmap.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePlanRequest {
    private UUID companyId;
    private UUID roleId;
    private Integer durationDays; // default 30
    private String mode; // COMPLETE or SPECIFIC_ROUND
    private UUID roundId;
}
