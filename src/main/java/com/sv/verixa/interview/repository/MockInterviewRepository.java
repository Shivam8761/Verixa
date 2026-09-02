package com.sv.verixa.interview.repository;

import com.sv.verixa.interview.entity.MockInterview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MockInterviewRepository extends JpaRepository<MockInterview, UUID> {
    List<MockInterview> findByUserIdOrderByStartedAtDesc(UUID userId);
}
