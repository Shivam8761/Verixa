package com.sv.verixa.practice.repository;

import com.sv.verixa.practice.entity.QuestionAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuestionAttemptRepository extends JpaRepository<QuestionAttempt, UUID> {
    List<QuestionAttempt> findByUserIdOrderByAttemptedAtDesc(UUID userId);
    List<QuestionAttempt> findByUserIdAndQuestionIdOrderByAttemptedAtDesc(UUID userId, UUID questionId);

    @Query("SELECT qa FROM QuestionAttempt qa WHERE qa.userId = :userId AND qa.isCorrect = false ORDER BY qa.attemptedAt DESC")
    List<QuestionAttempt> findIncorrectAttemptsByUser(@Param("userId") UUID userId);
}
