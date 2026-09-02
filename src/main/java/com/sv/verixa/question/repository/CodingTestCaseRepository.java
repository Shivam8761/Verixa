package com.sv.verixa.question.repository;

import com.sv.verixa.question.entity.CodingTestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CodingTestCaseRepository extends JpaRepository<CodingTestCase, UUID> {
    List<CodingTestCase> findByQuestionId(UUID questionId);
    List<CodingTestCase> findByQuestionIdAndIsHiddenFalse(UUID questionId);
}
