package com.sv.verixa.ai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiChatRequest {

    @NotBlank(message = "Prompt message is required")
    private String prompt;

    private UUID questionId;
    private String contextType; // EXPLAIN, HINT, STUDY_PLAN, WEAKNESS_ANALYSIS
}
