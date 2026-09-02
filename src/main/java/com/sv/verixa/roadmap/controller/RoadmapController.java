package com.sv.verixa.roadmap.controller;

import com.sv.verixa.auth.entity.User;
import com.sv.verixa.auth.service.AuthService;
import com.sv.verixa.roadmap.dto.CreatePlanRequest;
import com.sv.verixa.roadmap.dto.RoadmapDto;
import com.sv.verixa.roadmap.service.RoadmapService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/preparation-plans")
@RequiredArgsConstructor
@Tag(name = "Preparation Roadmap", description = "Personalized 30-day target company study roadmap APIs")
public class RoadmapController {

    private final RoadmapService roadmapService;
    private final AuthService authService;

    @PostMapping
    @Operation(summary = "Generate a personalized target company preparation roadmap")
    public ResponseEntity<RoadmapDto> createPlan(
            @RequestBody CreatePlanRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        RoadmapDto plan = roadmapService.createPreparationPlan(user, request);
        return new ResponseEntity<>(plan, HttpStatus.CREATED);
    }

    @GetMapping("/me")
    @Operation(summary = "Get user preparation plans")
    public ResponseEntity<List<RoadmapDto>> getMyPlans(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(roadmapService.getUserPlans(user));
    }
}
