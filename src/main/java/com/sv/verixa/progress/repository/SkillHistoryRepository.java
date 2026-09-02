package com.sv.verixa.progress.repository;

import com.sv.verixa.progress.entity.SkillHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SkillHistoryRepository extends JpaRepository<SkillHistory, UUID> {
    List<SkillHistory> findByUserIdAndTopicIdOrderByRecordedAtAsc(UUID userId, UUID topicId);
    List<SkillHistory> findByUserIdOrderByRecordedAtAsc(UUID userId);
}
