package com.sv.verixa.question.controller;

import com.sv.verixa.company.dto.CompanyDto;
import com.sv.verixa.company.dto.JobRoleDto;
import com.sv.verixa.company.service.CompanyService;
import com.sv.verixa.question.dto.CreateQuestionRequest;
import com.sv.verixa.question.dto.QuestionDto;
import com.sv.verixa.question.service.QuestionService;
import com.sv.verixa.round.dto.RoundDto;
import com.sv.verixa.round.service.RoundService;
import com.sv.verixa.topic.dto.TopicDto;
import com.sv.verixa.topic.service.TopicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
@Tag(name = "Admin Panel", description = "Admin-only APIs for managing companies, roles, rounds, topics, and questions")
public class AdminController {

    private final QuestionService questionService;
    private final CompanyService companyService;
    private final RoundService roundService;
    private final TopicService topicService;

    @PostMapping("/questions")
    @Operation(summary = "Create a new question (MCQ, CODING, or TEXT)")
    public ResponseEntity<QuestionDto> createQuestion(@Valid @RequestBody CreateQuestionRequest request) {
        QuestionDto question = questionService.createQuestion(request);
        return new ResponseEntity<>(question, HttpStatus.CREATED);
    }

    @PostMapping("/companies")
    @Operation(summary = "Create a target company")
    public ResponseEntity<CompanyDto> createCompany(@Valid @RequestBody CompanyDto dto) {
        CompanyDto company = companyService.createCompany(dto);
        return new ResponseEntity<>(company, HttpStatus.CREATED);
    }

    @PostMapping("/roles")
    @Operation(summary = "Create a job role for a company")
    public ResponseEntity<JobRoleDto> createJobRole(@Valid @RequestBody JobRoleDto dto) {
        JobRoleDto role = companyService.createJobRole(dto);
        return new ResponseEntity<>(role, HttpStatus.CREATED);
    }

    @PostMapping("/rounds")
    @Operation(summary = "Create a recruitment selection round")
    public ResponseEntity<RoundDto> createRound(@Valid @RequestBody RoundDto dto) {
        RoundDto round = roundService.createRound(dto);
        return new ResponseEntity<>(round, HttpStatus.CREATED);
    }

    @PostMapping("/topics")
    @Operation(summary = "Create a topic")
    public ResponseEntity<TopicDto> createTopic(@Valid @RequestBody TopicDto dto) {
        TopicDto topic = topicService.createTopic(dto);
        return new ResponseEntity<>(topic, HttpStatus.CREATED);
    }
}
