package com.sv.verixa.roadmap.service;

import com.sv.verixa.auth.entity.User;
import com.sv.verixa.company.entity.Company;
import com.sv.verixa.company.entity.JobRole;
import com.sv.verixa.company.repository.CompanyRepository;
import com.sv.verixa.company.repository.JobRoleRepository;
import com.sv.verixa.roadmap.dto.CreatePlanRequest;
import com.sv.verixa.roadmap.dto.RoadmapDto;
import com.sv.verixa.roadmap.dto.RoadmapItemDto;
import com.sv.verixa.roadmap.entity.PreparationPlan;
import com.sv.verixa.roadmap.entity.PreparationPlanItem;
import com.sv.verixa.roadmap.entity.PreparationPlanItemRepository;
import com.sv.verixa.roadmap.repository.PreparationPlanRepository;
import com.sv.verixa.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoadmapService {

    private final PreparationPlanRepository preparationPlanRepository;
    private final PreparationPlanItemRepository preparationPlanItemRepository;
    private final CompanyRepository companyRepository;
    private final JobRoleRepository jobRoleRepository;

    @Transactional
    public RoadmapDto createPreparationPlan(User user, CreatePlanRequest request) {
        int duration = request.getDurationDays() != null ? request.getDurationDays() : 30;

        PreparationPlan plan = PreparationPlan.builder()
                .userId(user.getId())
                .companyId(request.getCompanyId())
                .roleId(request.getRoleId())
                .durationDays(duration)
                .build();

        PreparationPlan savedPlan = preparationPlanRepository.save(plan);

        List<PreparationPlanItem> items = generateScheduleItems(savedPlan.getId(), duration, request.getMode());
        preparationPlanItemRepository.saveAll(items);

        return getPlanById(savedPlan.getId());
    }

    @Transactional(readOnly = true)
    public List<RoadmapDto> getUserPlans(User user) {
        List<PreparationPlan> plans = preparationPlanRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return plans.stream().map(p -> getPlanById(p.getId())).toList();
    }

    @Transactional(readOnly = true)
    public RoadmapDto getPlanById(UUID planId) {
        PreparationPlan plan = preparationPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Preparation plan not found: " + planId));

        List<PreparationPlanItem> items = preparationPlanItemRepository.findByPlanIdOrderByDayNumberAsc(planId);

        String companyName = plan.getCompanyId() != null ?
                companyRepository.findById(plan.getCompanyId()).map(Company::getName).orElse(null) : "General";
        String roleTitle = plan.getRoleId() != null ?
                jobRoleRepository.findById(plan.getRoleId()).map(JobRole::getTitle).orElse(null) : "Placement Prep";

        List<RoadmapItemDto> itemDtos = items.stream()
                .map(i -> RoadmapItemDto.builder()
                        .id(i.getId())
                        .dayNumber(i.getDayNumber())
                        .topicName(i.getTopicName())
                        .taskDescription(i.getTaskDescription())
                        .isCompleted(i.getIsCompleted())
                        .build())
                .toList();

        return RoadmapDto.builder()
                .id(plan.getId())
                .companyId(plan.getCompanyId())
                .companyName(companyName)
                .roleId(plan.getRoleId())
                .roleTitle(roleTitle)
                .durationDays(plan.getDurationDays())
                .items(itemDtos)
                .build();
    }

    private List<PreparationPlanItem> generateScheduleItems(UUID planId, int durationDays, String mode) {
        List<PreparationPlanItem> list = new ArrayList<>();

        String[] topics = new String[]{
                "Aptitude", "Logical Reasoning", "Verbal Ability", "Java Fundamentals",
                "OOP Principles", "Arrays & Strings", "SQL & DBMS", "Operating Systems",
                "Linked Lists", "Stack & Queue", "Trees & Graphs", "Dynamic Programming",
                "Mock Technical Test", "AI HR Mock Interview"
        };

        for (int day = 1; day <= durationDays; day++) {
            String topic = topics[(day - 1) % topics.length];
            String task = "Day " + day + ": Focus on " + topic + ". Solve 5 PYQ-style practice questions and review explanations.";
            if (day % 7 == 0) {
                topic = "Weekly Assessment";
                task = "Day " + day + ": Take the Weekly Placement Challenge and review your weakest topic statistics.";
            }

            list.add(PreparationPlanItem.builder()
                    .planId(planId)
                    .dayNumber(day)
                    .topicName(topic)
                    .taskDescription(task)
                    .isCompleted(day == 1) // Mark day 1 completed by default
                    .build());
        }

        return list;
    }
}
