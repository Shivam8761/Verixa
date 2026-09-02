package com.sv.verixa.recommendation.repository;

import com.sv.verixa.recommendation.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, UUID> {
    List<Recommendation> findByUserIdAndIsDismissedFalseOrderByCreatedAtDesc(UUID userId);
}
