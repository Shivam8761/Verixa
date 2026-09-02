package com.sv.verixa.contest.repository;

import com.sv.verixa.contest.entity.ContestQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ContestQuestionRepository extends JpaRepository<ContestQuestion, UUID> {
    List<ContestQuestion> findByContestId(UUID contestId);
}
