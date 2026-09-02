package com.sv.verixa.question.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionOptionDto {
    private UUID id;
    private String optionText;
    private Boolean isCorrect;
    private String explanation;
}
