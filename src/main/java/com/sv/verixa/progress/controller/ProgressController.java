package com.sv.verixa.progress.controller;

import com.sv.verixa.auth.entity.User;
import com.sv.verixa.auth.service.AuthService;
import com.sv.verixa.progress.dto.ProgressOverviewDto;
import com.sv.verixa.progress.dto.SkillDto;
import com.sv.verixa.progress.service.ProgressService;
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
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Progress & Readiness", description = "Performance analytics, topic skill breakdown, and Interview Readiness Score APIs")
public class ProgressController {

    private final ProgressService progressService;
    private final AuthService authService;

    @GetMapping("/progress")
    @Operation(summary = "Get overall user progress and Interview Readiness Score")
    public ResponseEntity<ProgressOverviewDto> getProgress(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(progressService.getProgressOverview(user));
    }

    @GetMapping("/skills")
    @Operation(summary = "Get topic-wise skill mastery matrix")
    public ResponseEntity<List<SkillDto>> getSkills(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(progressService.getUserSkills(user));
    }
}
