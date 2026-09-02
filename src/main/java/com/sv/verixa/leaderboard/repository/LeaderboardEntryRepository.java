package com.sv.verixa.leaderboard.repository;

import com.sv.verixa.leaderboard.entity.LeaderboardEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LeaderboardEntryRepository extends JpaRepository<LeaderboardEntry, UUID> {
    List<LeaderboardEntry> findByContestIdOrderByRankAsc(UUID contestId);
    List<LeaderboardEntry> findByContestIdIsNullOrderByScoreDescTotalTimeSecondsAsc();
    Optional<LeaderboardEntry> findByContestIdAndUserId(UUID contestId, UUID userId);
}
