package com.sv.verixa.question.dto;

import com.sv.verixa.question.entity.Difficulty;
import com.sv.verixa.question.entity.QuestionCategory;
import com.sv.verixa.question.entity.QuestionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateQuestionRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Question type is required")
    private QuestionType questionType;

    @NotNull(message = "Category is required")
    private QuestionCategory category;

    @NotNull(message = "Difficulty is required")
    private Difficulty difficulty;

    private UUID companyId;
    private UUID roleId;
    private UUID roundId;

    @NotNull(message = "Topic ID is required")
    private UUID topicId;

    private Integer year;
    private String starterCode;
    private String solution;
    private String constraints;
    private String inputFormat;
    private String outputFormat;
    private String explanation;

    private List<QuestionOptionDto> options;
    private List<CodingTestCaseDto> testCases;
}
