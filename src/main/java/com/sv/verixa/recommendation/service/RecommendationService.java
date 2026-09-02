package com.sv.verixa.recommendation.service;

import com.sv.verixa.auth.entity.User;
import com.sv.verixa.progress.dto.ProgressOverviewDto;
import com.sv.verixa.progress.dto.SkillDto;
import com.sv.verixa.progress.service.ProgressService;
import com.sv.verixa.recommendation.dto.RecommendationDto;
import com.sv.verixa.recommendation.entity.Recommendation;
import com.sv.verixa.recommendation.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final ProgressService progressService;

    @Transactional(readOnly = true)
    public List<RecommendationDto> getRecommendationsForUser(User user) {
        ProgressOverviewDto overview = progressService.getProgressOverview(user);
        List<RecommendationDto> list = new ArrayList<>();

        if (overview.getWeakestTopicName() != null) {
            list.add(RecommendationDto.builder()
                    .title("Target Weakest Topic: " + overview.getWeakestTopicName())
                    .description("Your accuracy in " + overview.getWeakestTopicName() + " is below target. Solve 5 practice questions to strengthen your foundation.")
                    .recommendationType("PRACTICE")
                    .topicName(overview.getWeakestTopicName())
                    .build());
        } else {
            list.add(RecommendationDto.builder()
                    .title("Start TCS Ninja Complete Prep")
                    .description("Begin your preparation roadmap by solving Aptitude and Arrays questions tailored for TCS Ninja.")
                    .recommendationType("PRACTICE")
                    .topicName("Arrays")
                    .build());
        }

        list.add(RecommendationDto.builder()
                .title("Take an HR Mock Interview")
                .description("Practice AI-powered HR questions with voice feedback to build behavioral confidence.")
                .recommendationType("INTERVIEW")
                .topicName("HR & Behavioral")
                .build());

        list.add(RecommendationDto.builder()
                .title("Join Weekly Placement Challenge")
                .description("Compete against peers in real time and benchmark your speed against actual placement criteria.")
                .recommendationType("MOCK_TEST")
                .topicName("Contest")
                .build());

        return list;
    }
}
