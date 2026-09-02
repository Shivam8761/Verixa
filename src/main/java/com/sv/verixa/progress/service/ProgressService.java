package com.sv.verixa.progress.service;

import com.sv.verixa.auth.entity.User;
import com.sv.verixa.auth.entity.UserStreak;
import com.sv.verixa.auth.repository.UserStreakRepository;
import com.sv.verixa.codeexecution.entity.CodingSubmission;
import com.sv.verixa.codeexecution.repository.CodingSubmissionRepository;
import com.sv.verixa.practice.entity.QuestionAttempt;
import com.sv.verixa.practice.repository.QuestionAttemptRepository;
import com.sv.verixa.progress.dto.ProgressOverviewDto;
import com.sv.verixa.progress.dto.SkillDto;
import com.sv.verixa.progress.entity.UserSkill;
import com.sv.verixa.progress.repository.SkillHistoryRepository;
import com.sv.verixa.progress.repository.UserSkillRepository;
import com.sv.verixa.topic.entity.Topic;
import com.sv.verixa.topic.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final QuestionAttemptRepository questionAttemptRepository;
    private final CodingSubmissionRepository codingSubmissionRepository;
    private final UserSkillRepository userSkillRepository;
    private final SkillHistoryRepository skillHistoryRepository;
    private final UserStreakRepository userStreakRepository;
    private final TopicRepository topicRepository;

    @Transactional(readOnly = true)
    public ProgressOverviewDto getProgressOverview(User user) {
        List<QuestionAttempt> attempts = questionAttemptRepository.findByUserIdOrderByAttemptedAtDesc(user.getId());
        List<CodingSubmission> submissions = codingSubmissionRepository.findByUserIdOrderBySubmittedAtDesc(user.getId());
        UserStreak streak = userStreakRepository.findByUserId(user.getId()).orElse(UserStreak.builder().currentStreak(1).build());

        int totalAttempted = attempts.size() + submissions.size();
        long mcqCorrect = attempts.stream().filter(QuestionAttempt::getIsCorrect).count();
        long codingAccepted = submissions.stream().filter(s -> "ACCEPTED".equals(s.getStatus())).count();
        int totalSolved = (int) (mcqCorrect + codingAccepted);

        double overallAccuracy = totalAttempted > 0 ? ((double) totalSolved / totalAttempted) * 100.0 : 0.0;
        int codingSuccessRate = !submissions.isEmpty() ? (int) (((double) codingAccepted / submissions.size()) * 100.0) : 0;

        List<SkillDto> skills = getUserSkills(user);

        String weakestTopic = null;
        String strongestTopic = null;
        if (!skills.isEmpty()) {
            skills.sort(Comparator.comparingInt(SkillDto::getMasteryScore));
            weakestTopic = skills.get(0).getTopicName();
            strongestTopic = skills.get(skills.size() - 1).getTopicName();
        }

        // Deterministic Readiness Score Calculation (Rule 19)
        Integer readinessScore = null;
        String readinessLabel = "Not enough data yet";

        if (totalAttempted >= 3) {
            double technicalScore = calculateCategoryScore(skills, "SUBJECT");
            double codingScore = codingSuccessRate;
            double aptitudeScore = calculateCategoryScore(skills, "QUANT");
            double hrScore = calculateCategoryScore(skills, "HR");
            double mockScore = overallAccuracy;
            double consistencyScore = Math.min(100.0, streak.getCurrentStreak() * 14.2); // 7 days = 100%

            double weightedScore = (technicalScore * 0.25)
                    + (codingScore * 0.25)
                    + (aptitudeScore * 0.15)
                    + (hrScore * 0.15)
                    + (mockScore * 0.10)
                    + (consistencyScore * 0.10);

            readinessScore = (int) Math.round(weightedScore);
            if (readinessScore >= 80) readinessLabel = "Interview Ready";
            else if (readinessScore >= 60) readinessLabel = "Good Progress";
            else readinessLabel = "Developing Skills";
        }

        return ProgressOverviewDto.builder()
                .readinessScore(readinessScore)
                .readinessLabel(readinessLabel)
                .totalAttempted(totalAttempted)
                .totalSolved(totalSolved)
                .overallAccuracy(Math.round(overallAccuracy * 10.0) / 10.0)
                .codingSuccessRate(codingSuccessRate)
                .currentStreak(streak.getCurrentStreak())
                .weakestTopicName(weakestTopic)
                .strongestTopicName(strongestTopic)
                .skills(skills)
                .build();
    }

    @Transactional(readOnly = true)
    public List<SkillDto> getUserSkills(User user) {
        List<UserSkill> userSkills = userSkillRepository.findByUserId(user.getId());
        List<SkillDto> dtos = new ArrayList<>();

        for (UserSkill us : userSkills) {
            Topic topic = topicRepository.findById(us.getTopicId()).orElse(null);
            dtos.add(SkillDto.builder()
                    .id(us.getId())
                    .topicId(us.getTopicId())
                    .topicName(topic != null ? topic.getName() : "General")
                    .category(topic != null ? topic.getCategory() : "DSA")
                    .accuracyPercentage(us.getAccuracyPercentage())
                    .questionsAttempted(us.getQuestionsAttempted())
                    .questionsSolved(us.getQuestionsSolved())
                    .masteryScore(us.getMasteryScore())
                    .updatedAt(us.getUpdatedAt())
                    .build());
        }

        return dtos;
    }

    private double calculateCategoryScore(List<SkillDto> skills, String category) {
        List<SkillDto> categorySkills = skills.stream()
                .filter(s -> category.equalsIgnoreCase(s.getCategory()))
                .toList();
        if (categorySkills.isEmpty()) return 50.0; // Default baseline if category not yet attempted
        return categorySkills.stream().mapToInt(SkillDto::getMasteryScore).average().orElse(50.0);
    }
}
