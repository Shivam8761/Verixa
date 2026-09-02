package com.sv.verixa.contest.repository;

import com.sv.verixa.contest.entity.ContestSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ContestSubmissionRepository extends JpaRepository<ContestSubmission, UUID> {
    List<ContestSubmission> findByContestIdAndUserId(UUID contestId, UUID userId);
    List<ContestSubmission> findByContestId(UUID contestId);
}
