package com.sv.verixa.codeexecution.controller;

import com.sv.verixa.auth.entity.User;
import com.sv.verixa.auth.service.AuthService;
import com.sv.verixa.codeexecution.dto.CodeExecutionRequest;
import com.sv.verixa.codeexecution.dto.CodeExecutionResult;
import com.sv.verixa.codeexecution.service.CodeExecutionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/code")
@RequiredArgsConstructor
@Tag(name = "Code Compiler & Runner", description = "Real Code Execution Sandbox APIs for Java and DSA problems")
public class CodeExecutionController {

    private final CodeExecutionService codeExecutionService;
    private final AuthService authService;

    @PostMapping("/execute")
    @Operation(summary = "Run source code against custom input or sample test cases")
    public ResponseEntity<CodeExecutionResult> executeCode(@Valid @RequestBody CodeExecutionRequest request) {
        CodeExecutionResult result = codeExecutionService.executeCode(request);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/submit")
    @Operation(summary = "Submit coding solution for full test case evaluation")
    public ResponseEntity<CodeExecutionResult> submitCode(
            @Valid @RequestBody CodeExecutionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        CodeExecutionResult result = codeExecutionService.submitCode(user, request);
        return ResponseEntity.ok(result);
    }
}
