package com.sv.verixa.interview.service;

import com.sv.verixa.ai.service.AiService;
import com.sv.verixa.auth.entity.User;
import com.sv.verixa.interview.dto.*;
import com.sv.verixa.interview.entity.InterviewAnswer;
import com.sv.verixa.interview.entity.MockInterview;
import com.sv.verixa.interview.repository.InterviewAnswerRepository;
import com.sv.verixa.interview.repository.MockInterviewRepository;
import com.sv.verixa.kafka.producer.KafkaEventProducer;
import com.sv.verixa.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MockInterviewService {

    private final MockInterviewRepository mockInterviewRepository;
    private final InterviewAnswerRepository interviewAnswerRepository;
    private final AiService aiService;
    private final KafkaEventProducer kafkaEventProducer;

    @Transactional
    public InterviewResponse startInterview(User user, StartInterviewRequest request) {
        MockInterview interview = MockInterview.builder()
                .userId(user.getId())
                .companyId(request.getCompanyId())
                .roleId(request.getRoleId())
                .roundType(request.getRoundType() != null ? request.getRoundType() : "HR")
                .status("IN_PROGRESS")
                .build();

        MockInterview saved = mockInterviewRepository.save(interview);

        String initialQuestion = "Hello " + user.getFullName() + "! Welcome to your " + (interview.getRoundType()) + " mock interview for TCS Ninja. To get started, please introduce yourself and highlight your key software development projects.";

        return InterviewResponse.builder()
                .interviewId(saved.getId())
                .nextQuestionText(initialQuestion)
                .isCompleted(false)
                .build();
    }

    @Transactional
    public InterviewResponse answerQuestion(User user, UUID interviewId, AnswerInterviewRequest request) {
        MockInterview interview = mockInterviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Mock interview not found with id: " + interviewId));

        Map<String, Object> eval = aiService.evaluateAnswerAndFollowUp(request.getQuestionText(), request.getAnswerText());

        InterviewAnswer answer = InterviewAnswer.builder()
                .mockInterviewId(interviewId)
                .questionText(request.getQuestionText())
                .userAnswerText(request.getAnswerText())
                .communicationScore((Integer) eval.get("commScore"))
                .clarityScore((Integer) eval.get("clarityScore"))
                .relevanceScore((Integer) eval.get("relevanceScore"))
                .confidenceScore((Integer) eval.get("confidenceScore"))
                .professionalismScore((Integer) eval.get("professionalismScore"))
                .feedback((String) eval.get("feedback"))
                .build();

        interviewAnswerRepository.save(answer);

        List<InterviewAnswer> previousAnswers = interviewAnswerRepository.findByMockInterviewIdOrderByCreatedAtAsc(interviewId);

        // Complete interview after 4 turns
        if (previousAnswers.size() >= 4) {
            return completeInterview(user, interviewId);
        }

        return InterviewResponse.builder()
                .interviewId(interviewId)
                .nextQuestionText((String) eval.get("followUpQuestion"))
                .feedbackOnLastAnswer((String) eval.get("feedback"))
                .communicationScore((Integer) eval.get("commScore"))
                .relevanceScore((Integer) eval.get("relevanceScore"))
                .confidenceScore((Integer) eval.get("confidenceScore"))
                .isCompleted(false)
                .build();
    }

    @Transactional
    public InterviewResponse completeInterview(User user, UUID interviewId) {
        MockInterview interview = mockInterviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Mock interview not found with id: " + interviewId));

        List<InterviewAnswer> answers = interviewAnswerRepository.findByMockInterviewIdOrderByCreatedAtAsc(interviewId);
        InterviewEvaluationDto evaluation = aiService.generateFinalEvaluation(interviewId, answers);

        interview.setStatus("COMPLETED");
        interview.setOverallScore(evaluation.getOverallScore());
        interview.setCompletedAt(ZonedDateTime.now());
        mockInterviewRepository.save(interview);

        kafkaEventProducer.publishEvent(
                KafkaEventProducer.TOPIC_INTERVIEW_COMPLETED,
                user.getId().toString(),
                "{\"userId\":\"" + user.getId() + "\",\"interviewId\":\"" + interviewId + "\",\"score\":" + evaluation.getOverallScore() + "}"
        );

        return InterviewResponse.builder()
                .interviewId(interviewId)
                .isCompleted(true)
                .finalEvaluation(evaluation)
                .build();
    }
}
