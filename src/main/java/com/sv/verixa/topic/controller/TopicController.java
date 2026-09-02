package com.sv.verixa.topic.controller;

import com.sv.verixa.topic.dto.TopicDto;
import com.sv.verixa.topic.service.TopicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
@Tag(name = "Topics", description = "Topic taxonomy APIs for DSA, Subjects, Quant, and HR")
public class TopicController {

    private final TopicService topicService;

    @GetMapping
    @Operation(summary = "Get all study & practice topics")
    public ResponseEntity<List<TopicDto>> getAllTopics(@RequestParam(required = false) String category) {
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(topicService.getTopicsByCategory(category));
        }
        return ResponseEntity.ok(topicService.getAllTopics());
    }
}
