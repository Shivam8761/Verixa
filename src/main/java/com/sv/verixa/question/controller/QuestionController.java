package com.sv.verixa.question.controller;

import com.sv.verixa.question.dto.QuestionDto;
import com.sv.verixa.question.entity.Difficulty;
import com.sv.verixa.question.entity.QuestionType;
import com.sv.verixa.question.service.QuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Questions", description = "Public question query and search APIs")
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping("/questions")
    @Operation(summary = "Search and filter questions")
    public ResponseEntity<List<QuestionDto>> getQuestions(
            @RequestParam(required = false) UUID companyId,
            @RequestParam(required = false) UUID roleId,
            @RequestParam(required = false) UUID roundId,
            @RequestParam(required = false) UUID topicId,
            @RequestParam(required = false) Difficulty difficulty,
            @RequestParam(required = false) QuestionType questionType,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(questionService.searchQuestions(companyId, roleId, roundId, topicId, difficulty, questionType, category));
    }

    @GetMapping("/dsa/questions")
    @Operation(summary = "Get generic company-agnostic DSA questions")
    public ResponseEntity<List<QuestionDto>> getGeneralDsaQuestions(
            @RequestParam(required = false) Difficulty difficulty) {
        return ResponseEntity.ok(questionService.getGeneralDsaQuestions(difficulty));
    }

    @GetMapping("/questions/{id}")
    @Operation(summary = "Get single question details")
    public ResponseEntity<QuestionDto> getQuestionById(@PathVariable UUID id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }
}
