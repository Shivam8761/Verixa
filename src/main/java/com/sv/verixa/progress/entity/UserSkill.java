package com.sv.verixa.progress.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_skills", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "topic_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "topic_id", nullable = false)
    private UUID topicId;

    @Column(name = "accuracy_percentage", nullable = false)
    private Double accuracyPercentage;

    @Column(name = "questions_attempted", nullable = false)
    private Integer questionsAttempted;

    @Column(name = "questions_solved", nullable = false)
    private Integer questionsSolved;

    @Column(name = "mastery_score", nullable = false)
    private Integer masteryScore; // 0 to 100

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;
}
