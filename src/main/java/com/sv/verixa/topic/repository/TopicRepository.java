package com.sv.verixa.topic.repository;

import com.sv.verixa.topic.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TopicRepository extends JpaRepository<Topic, UUID> {
    List<Topic> findByCategory(String category);
    Optional<Topic> findByNameIgnoreCase(String name);
}
