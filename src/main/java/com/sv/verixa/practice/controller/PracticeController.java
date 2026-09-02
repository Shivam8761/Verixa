package com.sv.verixa.practice.controller;

import com.sv.verixa.auth.entity.User;
import com.sv.verixa.auth.service.AuthService;
import com.sv.verixa.practice.dto.AttemptRequest;
import com.sv.verixa.practice.dto.AttemptResultResponse;
import com.sv.verixa.practice.service.PracticeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@Tag(name = "Practice Engine", description = "Question attempt submission & evaluation APIs")
public class PracticeController {

    private final PracticeService practiceService;
    private final AuthService authService;

    @PostMapping("/{id}/attempt")
    @Operation(summary = "Submit an answer attempt for an MCQ or Text question")
    public ResponseEntity<AttemptResultResponse> attemptQuestion(
            @PathVariable UUID id,
            @RequestBody AttemptRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        AttemptResultResponse result = practiceService.attemptQuestion(user, id, request);
        return ResponseEntity.ok(result);
    }
}
