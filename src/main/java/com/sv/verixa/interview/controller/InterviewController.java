package com.sv.verixa.interview.controller;

import com.sv.verixa.auth.entity.User;
import com.sv.verixa.auth.service.AuthService;
import com.sv.verixa.interview.dto.*;
import com.sv.verixa.interview.service.MockInterviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
@Tag(name = "AI HR Mock Interview", description = "AI-powered conversational HR and Technical mock interviews with scorecard feedback")
public class InterviewController {

    private final MockInterviewService mockInterviewService;
    private final AuthService authService;

    @PostMapping
    @Operation(summary = "Initialize a new AI Mock Interview session")
    public ResponseEntity<InterviewResponse> startInterview(
            @RequestBody StartInterviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        InterviewResponse response = mockInterviewService.startInterview(user, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/answer")
    @Operation(summary = "Submit candidate response and receive AI follow-up question")
    public ResponseEntity<InterviewResponse> answerQuestion(
            @PathVariable UUID id,
            @Valid @RequestBody AnswerInterviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        InterviewResponse response = mockInterviewService.answerQuestion(user, id, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/complete")
    @Operation(summary = "Complete interview and receive complete evaluation scorecard")
    public ResponseEntity<InterviewResponse> completeInterview(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        InterviewResponse response = mockInterviewService.completeInterview(user, id);
        return ResponseEntity.ok(response);
    }
}
