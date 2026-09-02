package com.sv.verixa.contest.controller;

import com.sv.verixa.auth.entity.User;
import com.sv.verixa.auth.service.AuthService;
import com.sv.verixa.contest.dto.ContestDto;
import com.sv.verixa.contest.dto.ContestSubmissionRequest;
import com.sv.verixa.contest.service.ContestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/contests")
@RequiredArgsConstructor
@Tag(name = "Weekly Contests", description = "Live contest schedule, arena questions, and contest submission APIs")
public class ContestController {

    private final ContestService contestService;
    private final AuthService authService;

    @GetMapping
    @Operation(summary = "Get all weekly contests")
    public ResponseEntity<List<ContestDto>> getAllContests() {
        return ResponseEntity.ok(contestService.getAllContests());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get contest details and question arena")
    public ResponseEntity<ContestDto> getContestById(@PathVariable UUID id) {
        return ResponseEntity.ok(contestService.getContestById(id));
    }

    @PostMapping("/{id}/submit")
    @Operation(summary = "Submit contest answers and calculate rank score")
    public ResponseEntity<ContestDto> submitContest(
            @PathVariable UUID id,
            @RequestBody ContestSubmissionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        ContestDto result = contestService.submitContest(user, id, request);
        return ResponseEntity.ok(result);
    }
}
