package com.sv.verixa.progress.repository;

import com.sv.verixa.progress.entity.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, UUID> {
    List<UserSkill> findByUserId(UUID userId);
    Optional<UserSkill> findByUserIdAndTopicId(UUID userId, UUID topicId);
}
