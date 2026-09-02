package com.sv.verixa.question.dto;

import com.sv.verixa.question.entity.Difficulty;
import com.sv.verixa.question.entity.QuestionCategory;
import com.sv.verixa.question.entity.QuestionType;
import lombok.*;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDto {
    private UUID id;
    private String title;
    private String description;
    private QuestionType questionType;
    private QuestionCategory category;
    private Difficulty difficulty;
    private UUID companyId;
    private String companyName;
    private UUID roleId;
    private String roleName;
    private UUID roundId;
    private String roundName;
    private UUID topicId;
    private String topicName;
    private Integer year;
    private String starterCode;
    private String solution;
    private String constraints;
    private String inputFormat;
    private String outputFormat;
    private String explanation;
    private List<QuestionOptionDto> options;
    private List<CodingTestCaseDto> sampleTestCases;
    private ZonedDateTime createdAt;
}
