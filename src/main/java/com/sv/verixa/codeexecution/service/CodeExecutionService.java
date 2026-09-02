package com.sv.verixa.codeexecution.service;

import com.sv.verixa.auth.entity.User;
import com.sv.verixa.codeexecution.dto.*;
import com.sv.verixa.codeexecution.entity.CodingSubmission;
import com.sv.verixa.codeexecution.repository.CodingSubmissionRepository;
import com.sv.verixa.codeexecution.sandbox.SandboxCodeRunner;
import com.sv.verixa.kafka.producer.KafkaEventProducer;
import com.sv.verixa.question.entity.CodingTestCase;
import com.sv.verixa.question.repository.CodingTestCaseRepository;
import com.sv.verixa.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.sv.verixa.question.entity.Question;
import com.sv.verixa.question.repository.QuestionRepository;
import com.sv.verixa.progress.entity.UserSkill;
import com.sv.verixa.progress.repository.UserSkillRepository;

@Service
@RequiredArgsConstructor
public class CodeExecutionService {

    private final SandboxCodeRunner sandboxCodeRunner;
    private final CodingTestCaseRepository codingTestCaseRepository;
    private final CodingSubmissionRepository codingSubmissionRepository;
    private final QuestionRepository questionRepository;
    private final UserSkillRepository userSkillRepository;
    private final KafkaEventProducer kafkaEventProducer;

    public CodeExecutionResult executeCode(CodeExecutionRequest request) {
        if (request.getInputData() != null) {
            CodeExecutionResult rawResult = sandboxCodeRunner.executeJava(request.getSourceCode(), request.getInputData());
            if ("SUCCESS".equals(rawResult.getStatus())) {
                rawResult.setStatus("EXECUTED");
            }
            return rawResult;
        }

        // If questionId is provided, run against sample test cases
        if (request.getQuestionId() != null) {
            List<CodingTestCase> testCases = codingTestCaseRepository.findByQuestionIdAndIsHiddenFalse(request.getQuestionId());
            return evaluateAgainstTestCases(request.getSourceCode(), testCases, false);
        }

        return sandboxCodeRunner.executeJava(request.getSourceCode(), "");
    }

    @Transactional
    public CodeExecutionResult submitCode(User user, CodeExecutionRequest request) {
        if (request.getQuestionId() == null) {
            throw new ResourceNotFoundException("Question ID is required for code submission");
        }

        List<CodingTestCase> allTestCases = codingTestCaseRepository.findByQuestionId(request.getQuestionId());
        if (allTestCases.isEmpty()) {
            throw new ResourceNotFoundException("No test cases registered for question: " + request.getQuestionId());
        }

        CodeExecutionResult result = evaluateAgainstTestCases(request.getSourceCode(), allTestCases, true);

        // Save coding submission record
        CodingSubmission submission = CodingSubmission.builder()
                .userId(user.getId())
                .questionId(request.getQuestionId())
                .language(request.getLanguage())
                .sourceCode(request.getSourceCode())
                .status(result.getStatus())
                .runtimeMs(result.getRuntimeMs() != null ? result.getRuntimeMs().intValue() : 0)
                .memoryKb(result.getMemoryKb() != null ? result.getMemoryKb() : 0)
                .testCasesPassed(result.getTestCasesPassed())
                .totalTestCases(result.getTotalTestCases())
                .build();

        codingSubmissionRepository.save(submission);

        questionRepository.findById(request.getQuestionId()).ifPresent(q -> {
            if (q.getTopicId() != null) {
                updateUserSkill(user.getId(), q.getTopicId(), "ACCEPTED".equals(result.getStatus()));
            }
        });

        // Publish event to Kafka
        kafkaEventProducer.publishEvent(
                KafkaEventProducer.TOPIC_CODING_SUBMISSION,
                user.getId().toString(),
                "{\"userId\":\"" + user.getId() + "\",\"questionId\":\"" + request.getQuestionId() + "\",\"status\":\"" + result.getStatus() + "\"}"
        );

        return result;
    }

    private CodeExecutionResult evaluateAgainstTestCases(String sourceCode, List<CodingTestCase> testCases, boolean isSubmission) {
        int passed = 0;
        long totalRuntime = 0;
        List<TestCaseResult> tcResults = new ArrayList<>();
        String overallStatus = "ACCEPTED";
        String compileErr = null;
        String stdErr = null;

        for (CodingTestCase tc : testCases) {
            CodeExecutionResult singleRun = sandboxCodeRunner.executeJava(sourceCode, tc.getInputData());
            totalRuntime += (singleRun.getRuntimeMs() != null ? singleRun.getRuntimeMs() : 0);

            if ("COMPILATION_ERROR".equals(singleRun.getStatus())) {
                return CodeExecutionResult.builder()
                        .status("COMPILATION_ERROR")
                        .compileOutput(singleRun.getCompileOutput())
                        .testCasesPassed(0)
                        .totalTestCases(testCases.size())
                        .build();
            }

            if ("TIME_LIMIT_EXCEEDED".equals(singleRun.getStatus())) {
                overallStatus = "TIME_LIMIT_EXCEEDED";
            } else if ("RUNTIME_ERROR".equals(singleRun.getStatus())) {
                if ("ACCEPTED".equals(overallStatus)) overallStatus = "RUNTIME_ERROR";
                stdErr = singleRun.getStderr();
            }

            String actualOutput = singleRun.getStdout() != null ? singleRun.getStdout().trim() : "";
            String expectedOutput = tc.getExpectedOutput() != null ? tc.getExpectedOutput().trim() : "";
            boolean isMatch = actualOutput.equals(expectedOutput);

            if (isMatch) {
                passed++;
            } else {
                if ("ACCEPTED".equals(overallStatus)) {
                    overallStatus = "WRONG_ANSWER";
                }
            }

            // Rule 16: Hidden test cases MUST NOT send input/expectedOutput details to frontend
            tcResults.add(TestCaseResult.builder()
                    .testCaseId(tc.getId())
                    .input(Boolean.TRUE.equals(tc.getIsHidden()) && isSubmission ? "[HIDDEN]" : tc.getInputData())
                    .expectedOutput(Boolean.TRUE.equals(tc.getIsHidden()) && isSubmission ? "[HIDDEN]" : tc.getExpectedOutput())
                    .actualOutput(Boolean.TRUE.equals(tc.getIsHidden()) && isSubmission ? (isMatch ? "[PASSED]" : "[FAILED]") : actualOutput)
                    .passed(isMatch)
                    .isHidden(tc.getIsHidden())
                    .build());
        }

        return CodeExecutionResult.builder()
                .status(passed == testCases.size() ? "ACCEPTED" : overallStatus)
                .runtimeMs(testCases.isEmpty() ? 0 : totalRuntime / testCases.size())
                .stderr(stdErr)
                .testCasesPassed(passed)
                .totalTestCases(testCases.size())
                .testCaseResults(tcResults)
                .build();
    }

    private void updateUserSkill(UUID userId, UUID topicId, boolean isCorrect) {
        UserSkill skill = userSkillRepository.findByUserIdAndTopicId(userId, topicId)
                .orElse(UserSkill.builder()
                        .userId(userId)
                        .topicId(topicId)
                        .questionsAttempted(0)
                        .questionsSolved(0)
                        .accuracyPercentage(0.0)
                        .masteryScore(0)
                        .build());

        int attempted = skill.getQuestionsAttempted() + 1;
        int solved = skill.getQuestionsSolved() + (isCorrect ? 1 : 0);
        double accuracy = ((double) solved / attempted) * 100.0;
        int mastery = (int) Math.round(accuracy);

        skill.setQuestionsAttempted(attempted);
        skill.setQuestionsSolved(solved);
        skill.setAccuracyPercentage(Math.round(accuracy * 10.0) / 10.0);
        skill.setMasteryScore(mastery);

        userSkillRepository.save(skill);
    }
}
