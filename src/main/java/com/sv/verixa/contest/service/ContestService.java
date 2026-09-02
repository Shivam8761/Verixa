package com.sv.verixa.contest.service;

import com.sv.verixa.auth.entity.User;
import com.sv.verixa.auth.repository.UserRepository;
import com.sv.verixa.contest.dto.ContestDto;
import com.sv.verixa.contest.dto.ContestSubmissionRequest;
import com.sv.verixa.contest.entity.Contest;
import com.sv.verixa.contest.entity.ContestQuestion;
import com.sv.verixa.contest.entity.ContestSubmission;
import com.sv.verixa.contest.repository.ContestQuestionRepository;
import com.sv.verixa.contest.repository.ContestRepository;
import com.sv.verixa.contest.repository.ContestSubmissionRepository;
import com.sv.verixa.kafka.producer.KafkaEventProducer;
import com.sv.verixa.leaderboard.entity.LeaderboardEntry;
import com.sv.verixa.leaderboard.repository.LeaderboardEntryRepository;
import com.sv.verixa.question.dto.QuestionDto;
import com.sv.verixa.question.entity.Question;
import com.sv.verixa.question.entity.QuestionOption;
import com.sv.verixa.question.repository.QuestionOptionRepository;
import com.sv.verixa.question.repository.QuestionRepository;
import com.sv.verixa.question.service.QuestionService;
import com.sv.verixa.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContestService {

    private final ContestRepository contestRepository;
    private final ContestQuestionRepository contestQuestionRepository;
    private final ContestSubmissionRepository contestSubmissionRepository;
    private final QuestionRepository questionRepository;
    private final QuestionOptionRepository questionOptionRepository;
    private final QuestionService questionService;
    private final LeaderboardEntryRepository leaderboardEntryRepository;
    private final UserRepository userRepository;
    private final KafkaEventProducer kafkaEventProducer;

    @Transactional(readOnly = true)
    public List<ContestDto> getAllContests() {
        return contestRepository.findAll().stream()
                .map(this::mapToContestDtoHeader)
                .toList();
    }

    @Transactional(readOnly = true)
    public ContestDto getContestById(UUID id) {
        Contest contest = contestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contest not found with id: " + id));

        List<ContestQuestion> contestQuestions = contestQuestionRepository.findByContestId(id);
        List<QuestionDto> questions = contestQuestions.stream()
                .map(cq -> questionService.getQuestionById(cq.getQuestionId()))
                .toList();

        ContestDto dto = mapToContestDtoHeader(contest);
        dto.setQuestions(questions);
        return dto;
    }

    @Transactional
    public ContestDto submitContest(User user, UUID contestId, ContestSubmissionRequest request) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new ResourceNotFoundException("Contest not found with id: " + contestId));

        int totalScore = 0;
        int totalQuestions = request.getSubmissions() != null ? request.getSubmissions().size() : 0;
        int correctCount = 0;

        if (request.getSubmissions() != null) {
            for (ContestSubmissionRequest.SingleSubmission sub : request.getSubmissions()) {
                Question question = questionRepository.findById(sub.getQuestionId()).orElse(null);
                boolean isCorrect = false;
                int points = 10;

                if (question != null && question.getQuestionType() == com.sv.verixa.question.entity.QuestionType.MCQ) {
                    List<QuestionOption> options = questionOptionRepository.findByQuestionId(question.getId());
                    Optional<QuestionOption> correctOpt = options.stream().filter(QuestionOption::getIsCorrect).findFirst();
                    if (correctOpt.isPresent() && sub.getSelectedOptionId() != null && sub.getSelectedOptionId().equals(correctOpt.get().getId())) {
                        isCorrect = true;
                    }
                } else if (sub.getAnswer() != null && !sub.getAnswer().isBlank()) {
                    isCorrect = true;
                }

                if (isCorrect) {
                    correctCount++;
                    totalScore += points;
                }

                ContestSubmission cSub = ContestSubmission.builder()
                        .contestId(contestId)
                        .userId(user.getId())
                        .questionId(sub.getQuestionId())
                        .answer(sub.getAnswer() != null ? sub.getAnswer() : (sub.getSelectedOptionId() != null ? sub.getSelectedOptionId().toString() : ""))
                        .score(isCorrect ? points : 0)
                        .status(isCorrect ? "PASSED" : "FAILED")
                        .build();

                contestSubmissionRepository.save(cSub);
            }
        }

        double accuracy = totalQuestions > 0 ? ((double) correctCount / totalQuestions) * 100.0 : 0.0;

        // Update / Insert Leaderboard Entry
        LeaderboardEntry entry = leaderboardEntryRepository.findByContestIdAndUserId(contestId, user.getId())
                .orElse(LeaderboardEntry.builder()
                        .contestId(contestId)
                        .userId(user.getId())
                        .rank(1)
                        .build());

        entry.setScore(totalScore);
        entry.setAccuracy(accuracy);
        entry.setTotalTimeSeconds(1800); // 30 minutes simulated active time
        leaderboardEntryRepository.save(entry);

        // Recalculate contest rankings
        recalculateContestLeaderboard(contestId);

        // Kafka Event
        kafkaEventProducer.publishEvent(
                KafkaEventProducer.TOPIC_CONTEST_COMPLETED,
                user.getId().toString(),
                "{\"userId\":\"" + user.getId() + "\",\"contestId\":\"" + contestId + "\",\"score\":" + totalScore + "}"
        );

        return getContestById(contestId);
    }

    private void recalculateContestLeaderboard(UUID contestId) {
        List<LeaderboardEntry> entries = leaderboardEntryRepository.findByContestIdOrderByRankAsc(contestId);
        entries.sort((a, b) -> {
            int cmp = Integer.compare(b.getScore(), a.getScore());
            if (cmp != 0) return cmp;
            return Integer.compare(a.getTotalTimeSeconds(), b.getTotalTimeSeconds());
        });

        for (int i = 0; i < entries.size(); i++) {
            entries.get(i).setRank(i + 1);
        }
        leaderboardEntryRepository.saveAll(entries);
    }

    private ContestDto mapToContestDtoHeader(Contest contest) {
        return ContestDto.builder()
                .id(contest.getId())
                .title(contest.getTitle())
                .description(contest.getDescription())
                .startTime(contest.getStartTime())
                .endTime(contest.getEndTime())
                .durationMinutes(contest.getDurationMinutes())
                .status(contest.getStatus())
                .questions(new ArrayList<>())
                .build();
    }
}
