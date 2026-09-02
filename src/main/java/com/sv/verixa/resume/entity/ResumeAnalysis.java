package com.sv.verixa.resume.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "resume_analysis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "resume_id", nullable = false)
    private UUID resumeId;

    @Column(name = "target_company_id")
    private UUID targetCompanyId;

    @Column(name = "target_role_id")
    private UUID targetRoleId;

    @Column(name = "strong_skills", nullable = false, columnDefinition = "TEXT")
    private String strongSkills;

    @Column(name = "missing_skills", nullable = false, columnDefinition = "TEXT")
    private String missingSkills;

    @Column(name = "weak_areas", nullable = false, columnDefinition = "TEXT")
    private String weakAreas;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String recommendations;

    @Column(name = "overall_match_score", nullable = false)
    private Integer overallMatchScore;

    @CreationTimestamp
    @Column(name = "analyzed_at", updatable = false)
    private ZonedDateTime analyzedAt;
}
