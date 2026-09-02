package com.sv.verixa.codeexecution.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeExecutionRequest {

    private UUID questionId;

    @NotBlank(message = "Language is required (e.g. java)")
    private String language;

    @NotBlank(message = "Source code is required")
    private String sourceCode;

    private String inputData; // Optional custom test input for Run Code
}
