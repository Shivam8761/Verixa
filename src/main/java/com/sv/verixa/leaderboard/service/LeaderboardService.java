package com.sv.verixa.leaderboard.service;

import com.sv.verixa.auth.entity.User;
import com.sv.verixa.auth.repository.UserRepository;
import com.sv.verixa.leaderboard.dto.LeaderboardDto;
import com.sv.verixa.leaderboard.entity.LeaderboardEntry;
import com.sv.verixa.leaderboard.repository.LeaderboardEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final LeaderboardEntryRepository leaderboardEntryRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<LeaderboardDto> getContestLeaderboard(UUID contestId) {
        return leaderboardEntryRepository.findByContestIdOrderByRankAsc(contestId).stream()
                .map(this::mapToLeaderboardDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LeaderboardDto> getGlobalLeaderboard() {
        // Find entries across contests or global
        return leaderboardEntryRepository.findAll().stream()
                .sorted((a, b) -> Integer.compare(b.getScore(), a.getScore()))
                .map(this::mapToLeaderboardDto)
                .toList();
    }

    private LeaderboardDto mapToLeaderboardDto(LeaderboardEntry entry) {
        User user = userRepository.findById(entry.getUserId()).orElse(null);
        return LeaderboardDto.builder()
                .id(entry.getId())
                .contestId(entry.getContestId())
                .userId(entry.getUserId())
                .userFullName(user != null ? user.getFullName() : "Anonymous Candidate")
                .userEmail(user != null ? user.getEmail() : "")
                .rank(entry.getRank())
                .score(entry.getScore())
                .accuracy(entry.getAccuracy())
                .totalTimeSeconds(entry.getTotalTimeSeconds())
                .build();
    }
}
