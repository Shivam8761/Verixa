package com.sv.verixa.codeexecution.repository;

import com.sv.verixa.codeexecution.entity.CodingSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CodingSubmissionRepository extends JpaRepository<CodingSubmission, UUID> {
    List<CodingSubmission> findByUserIdOrderBySubmittedAtDesc(UUID userId);
    List<CodingSubmission> findByUserIdAndQuestionIdOrderBySubmittedAtDesc(UUID userId, UUID questionId);
}
