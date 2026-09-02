package com.sv.verixa.ai.controller;

import com.sv.verixa.ai.dto.AiChatRequest;
import com.sv.verixa.ai.dto.AiChatResponse;
import com.sv.verixa.ai.service.AiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Assistant", description = "Context-aware AI mentor for explanations, hints, and study guidance")
public class AiController {

    private final AiService aiService;

    @PostMapping("/chat")
    @Operation(summary = "Chat with VERIXA AI Assistant")
    public ResponseEntity<AiChatResponse> chat(@Valid @RequestBody AiChatRequest request) {
        AiChatResponse response = aiService.chat(request);
        return ResponseEntity.ok(response);
    }
}
