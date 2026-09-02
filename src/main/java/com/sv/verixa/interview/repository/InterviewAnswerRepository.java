package com.sv.verixa.interview.repository;

import com.sv.verixa.interview.entity.InterviewAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InterviewAnswerRepository extends JpaRepository<InterviewAnswer, UUID> {
    List<InterviewAnswer> findByMockInterviewIdOrderByCreatedAtAsc(UUID mockInterviewId);
}
