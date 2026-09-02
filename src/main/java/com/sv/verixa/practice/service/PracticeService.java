package com.sv.verixa.practice.service;

import com.sv.verixa.auth.entity.User;
import com.sv.verixa.kafka.producer.KafkaEventProducer;
import com.sv.verixa.practice.dto.AttemptRequest;
import com.sv.verixa.practice.dto.AttemptResultResponse;
import com.sv.verixa.practice.dto.MistakeDto;
import com.sv.verixa.practice.entity.QuestionAttempt;
import com.sv.verixa.practice.repository.QuestionAttemptRepository;
import com.sv.verixa.question.dto.QuestionDto;
import com.sv.verixa.question.entity.Question;
import com.sv.verixa.question.entity.QuestionOption;
import com.sv.verixa.question.repository.QuestionOptionRepository;
import com.sv.verixa.question.repository.QuestionRepository;
import com.sv.verixa.question.service.QuestionService;
import com.sv.verixa.progress.entity.UserSkill;
import com.sv.verixa.progress.repository.UserSkillRepository;
import com.sv.verixa.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class PracticeService {

    private final QuestionRepository questionRepository;
    private final QuestionOptionRepository questionOptionRepository;
    private final QuestionAttemptRepository questionAttemptRepository;
    private final UserSkillRepository userSkillRepository;
    private final QuestionService questionService;
    private final KafkaEventProducer kafkaEventProducer;

    @Transactional
    public AttemptResultResponse attemptQuestion(User user, UUID questionId, AttemptRequest request) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));

        boolean isCorrect = false;
        int score = 0;
        UUID correctOptionId = null;

        if (question.getQuestionType() == com.sv.verixa.question.entity.QuestionType.MCQ) {
            List<QuestionOption> options = questionOptionRepository.findByQuestionId(questionId);
            Optional<QuestionOption> correctOpt = options.stream().filter(QuestionOption::getIsCorrect).findFirst();
            if (correctOpt.isPresent()) {
                correctOptionId = correctOpt.get().getId();
                if (request.getSelectedOptionId() != null && request.getSelectedOptionId().equals(correctOptionId)) {
                    isCorrect = true;
                    score = 10;
                }
            }
        } else if (question.getQuestionType() == com.sv.verixa.question.entity.QuestionType.TEXT) {
            if (request.getTextAnswer() != null && !request.getTextAnswer().trim().isEmpty()) {
                isCorrect = true;
                score = 10;
            }
        }

        QuestionAttempt attempt = QuestionAttempt.builder()
                .userId(user.getId())
                .questionId(questionId)
                .selectedOptionId(request.getSelectedOptionId())
                .textAnswer(request.getTextAnswer())
                .isCorrect(isCorrect)
                .score(score)
                .timeSpentSeconds(request.getTimeSpentSeconds() != null ? request.getTimeSpentSeconds() : 0)
                .build();

        QuestionAttempt savedAttempt = questionAttemptRepository.save(attempt);

        if (question.getTopicId() != null) {
            updateUserSkill(user.getId(), question.getTopicId(), isCorrect);
        }

        // Publish Kafka Event
        kafkaEventProducer.publishEvent(
                KafkaEventProducer.TOPIC_QUESTION_ATTEMPTED,
                user.getId().toString(),
                "{\"userId\":\"" + user.getId() + "\",\"questionId\":\"" + questionId + "\",\"topicId\":\"" + question.getTopicId() + "\",\"isCorrect\":" + isCorrect + "}"
        );

        return AttemptResultResponse.builder()
                .attemptId(savedAttempt.getId())
                .questionId(questionId)
                .isCorrect(isCorrect)
                .score(score)
                .correctOptionId(correctOptionId)
                .explanation(question.getExplanation())
                .solution(question.getSolution())
                .build();
    }

    @Transactional(readOnly = true)
    public List<MistakeDto> getUserMistakes(User user) {
        List<QuestionAttempt> attempts = questionAttemptRepository.findByUserIdOrderByAttemptedAtDesc(user.getId());
        
        Map<UUID, List<QuestionAttempt>> questionAttemptsMap = new LinkedHashMap<>();
        for (QuestionAttempt qa : attempts) {
            questionAttemptsMap.computeIfAbsent(qa.getQuestionId(), k -> new ArrayList<>()).add(qa);
        }

        List<MistakeDto> mistakes = new ArrayList<>();
        for (Map.Entry<UUID, List<QuestionAttempt>> entry : questionAttemptsMap.entrySet()) {
            List<QuestionAttempt> qAttempts = entry.getValue();
            boolean latestIsCorrect = qAttempts.get(0).getIsCorrect();
            
            // If the latest attempt is incorrect or there are past mistakes
            if (!latestIsCorrect || qAttempts.stream().anyMatch(a -> !a.getIsCorrect())) {
                QuestionDto questionDto = questionService.getQuestionById(entry.getKey());
                mistakes.add(MistakeDto.builder()
                        .question(questionDto)
                        .totalAttempts(qAttempts.size())
                        .lastResult(latestIsCorrect)
                        .isMastered(latestIsCorrect)
                        .lastAttemptedAt(qAttempts.get(0).getAttemptedAt())
                        .build());
            }
        }

        return mistakes;
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
