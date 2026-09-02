package com.sv.verixa.codeexecution.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestCaseResult {
    private UUID testCaseId;
    private String input;
    private String expectedOutput;
    private String actualOutput;
    private Boolean passed;
    private Boolean isHidden;
}
