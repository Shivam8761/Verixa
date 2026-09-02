package com.sv.verixa.interview.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StartInterviewRequest {
    private UUID companyId;
    private UUID roleId;
    private String roundType; // HR, TECHNICAL
}
