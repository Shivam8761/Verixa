package com.sv.verixa.interview.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "interview_answers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "mock_interview_id", nullable = false)
    private UUID mockInterviewId;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "user_answer_text", nullable = false, columnDefinition = "TEXT")
    private String userAnswerText;

    @Column(name = "communication_score")
    private Integer communicationScore;

    @Column(name = "clarity_score")
    private Integer clarityScore;

    @Column(name = "relevance_score")
    private Integer relevanceScore;

    @Column(name = "confidence_score")
    private Integer confidenceScore;

    @Column(name = "professionalism_score")
    private Integer professionalismScore;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;
}
