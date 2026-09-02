package com.sv.verixa.ai.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiChatResponse {
    private String responseText;
    private String actionSuggestion;
}
