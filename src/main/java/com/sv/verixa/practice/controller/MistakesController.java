package com.sv.verixa.practice.controller;

import com.sv.verixa.auth.entity.User;
import com.sv.verixa.auth.service.AuthService;
import com.sv.verixa.practice.dto.MistakeDto;
import com.sv.verixa.practice.service.PracticeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mistakes")
@RequiredArgsConstructor
@Tag(name = "Mistake Notebook", description = "Track, retry, and review failed question attempts")
public class MistakesController {

    private final PracticeService practiceService;
    private final AuthService authService;

    @GetMapping
    @Operation(summary = "Get current user mistake notebook")
    public ResponseEntity<List<MistakeDto>> getMistakes(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        List<MistakeDto> mistakes = practiceService.getUserMistakes(user);
        return ResponseEntity.ok(mistakes);
    }
}
