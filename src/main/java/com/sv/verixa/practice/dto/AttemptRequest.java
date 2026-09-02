package com.sv.verixa.practice.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttemptRequest {
    private UUID selectedOptionId;
    private String textAnswer;
    private Integer timeSpentSeconds;
}
