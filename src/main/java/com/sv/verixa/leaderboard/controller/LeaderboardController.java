package com.sv.verixa.leaderboard.controller;

import com.sv.verixa.leaderboard.dto.LeaderboardDto;
import com.sv.verixa.leaderboard.service.LeaderboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
@Tag(name = "Leaderboard", description = "Real leaderboard rankings derived from user contest and question activity")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping
    @Operation(summary = "Get global overall platform leaderboard")
    public ResponseEntity<List<LeaderboardDto>> getGlobalLeaderboard() {
        return ResponseEntity.ok(leaderboardService.getGlobalLeaderboard());
    }

    @GetMapping("/contest/{contestId}")
    @Operation(summary = "Get contest-specific live leaderboard ranking")
    public ResponseEntity<List<LeaderboardDto>> getContestLeaderboard(@PathVariable UUID contestId) {
        return ResponseEntity.ok(leaderboardService.getContestLeaderboard(contestId));
    }
}
