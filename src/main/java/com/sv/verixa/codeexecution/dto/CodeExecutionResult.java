package com.sv.verixa.codeexecution.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeExecutionResult {
    private String status; // ACCEPTED, WRONG_ANSWER, COMPILATION_ERROR, RUNTIME_ERROR, TIME_LIMIT_EXCEEDED
    private String stdout;
    private String stderr;
    private String compileOutput;
    private Long runtimeMs;
    private Integer memoryKb;
    private Integer testCasesPassed;
    private Integer totalTestCases;
    private List<TestCaseResult> testCaseResults;
}
