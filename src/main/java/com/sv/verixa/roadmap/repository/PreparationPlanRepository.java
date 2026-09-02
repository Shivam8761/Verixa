package com.sv.verixa.roadmap.repository;

import com.sv.verixa.roadmap.entity.PreparationPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PreparationPlanRepository extends JpaRepository<PreparationPlan, UUID> {
    List<PreparationPlan> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
