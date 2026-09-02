package com.sv.verixa.interview.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerInterviewRequest {

    @NotBlank(message = "Question text is required")
    private String questionText;

    @NotBlank(message = "Answer text is required")
    private String answerText;
}
