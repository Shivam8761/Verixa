package com.sv.verixa.progress.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "skill_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "topic_id", nullable = false)
    private UUID topicId;

    @Column(name = "mastery_score", nullable = false)
    private Integer masteryScore;

    @CreationTimestamp
    @Column(name = "recorded_at", updatable = false)
    private ZonedDateTime recordedAt;
}
