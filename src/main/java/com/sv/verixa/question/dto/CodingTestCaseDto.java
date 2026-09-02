package com.sv.verixa.question.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodingTestCaseDto {
    private UUID id;
    private String inputData;
    private String expectedOutput;
    private Boolean isHidden;
}
