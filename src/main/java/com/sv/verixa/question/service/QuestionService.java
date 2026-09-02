package com.sv.verixa.question.service;

import com.sv.verixa.company.repository.CompanyRepository;
import com.sv.verixa.company.repository.JobRoleRepository;
import com.sv.verixa.round.repository.RoundRepository;
import com.sv.verixa.topic.repository.TopicRepository;
import com.sv.verixa.question.dto.*;
import com.sv.verixa.question.entity.*;
import com.sv.verixa.question.repository.*;
import com.sv.verixa.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final QuestionOptionRepository questionOptionRepository;
    private final CodingTestCaseRepository codingTestCaseRepository;
    private final CompanyRepository companyRepository;
    private final JobRoleRepository jobRoleRepository;
    private final RoundRepository roundRepository;
    private final TopicRepository topicRepository;

    @Transactional(readOnly = true)
    public List<QuestionDto> searchQuestions(UUID companyId, UUID roleId, UUID roundId, UUID topicId, Difficulty difficulty, QuestionType questionType, String category) {
        Specification<Question> spec = (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("active"), true));

            if (companyId != null) {
                predicates.add(cb.equal(root.get("companyId"), companyId));
            }
            if (roleId != null) {
                predicates.add(cb.equal(root.get("roleId"), roleId));
            }
            if (roundId != null) {
                predicates.add(cb.equal(root.get("roundId"), roundId));
            }
            if (topicId != null) {
                predicates.add(cb.equal(root.get("topicId"), topicId));
            }
            if (difficulty != null) {
                predicates.add(cb.equal(root.get("difficulty"), difficulty));
            }
            if (questionType != null) {
                predicates.add(cb.equal(root.get("questionType"), questionType));
            }
            if (category != null) {
                predicates.add(cb.equal(root.get("category"), QuestionCategory.valueOf(category)));
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        return questionRepository.findAll(spec).stream()
                .map(this::mapToQuestionDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<QuestionDto> getGeneralDsaQuestions(Difficulty difficulty) {
        Specification<Question> spec = (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("active"), true));
            predicates.add(cb.isNull(root.get("companyId")));
            if (difficulty != null) {
                predicates.add(cb.equal(root.get("difficulty"), difficulty));
            }
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        return questionRepository.findAll(spec).stream()
                .map(this::mapToQuestionDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public QuestionDto getQuestionById(UUID id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
        return mapToQuestionDto(question);
    }

    @Transactional
    public QuestionDto createQuestion(CreateQuestionRequest request) {
        Question question = Question.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .questionType(request.getQuestionType())
                .category(request.getCategory())
                .difficulty(request.getDifficulty())
                .companyId(request.getCompanyId())
                .roleId(request.getRoleId())
                .roundId(request.getRoundId())
                .topicId(request.getTopicId())
                .year(request.getYear())
                .starterCode(request.getStarterCode())
                .solution(request.getSolution())
                .constraints(request.getConstraints())
                .inputFormat(request.getInputFormat())
                .outputFormat(request.getOutputFormat())
                .explanation(request.getExplanation())
                .active(true)
                .build();

        Question savedQuestion = questionRepository.save(question);

        // Save Options for MCQ
        if (request.getOptions() != null && !request.getOptions().isEmpty()) {
            List<QuestionOption> options = request.getOptions().stream()
                    .map(o -> QuestionOption.builder()
                            .questionId(savedQuestion.getId())
                            .optionText(o.getOptionText())
                            .isCorrect(o.getIsCorrect())
                            .explanation(o.getExplanation())
                            .build())
                    .toList();
            questionOptionRepository.saveAll(options);
        }

        // Save Test Cases for Coding
        if (request.getTestCases() != null && !request.getTestCases().isEmpty()) {
            List<CodingTestCase> testCases = request.getTestCases().stream()
                    .map(tc -> CodingTestCase.builder()
                            .questionId(savedQuestion.getId())
                            .inputData(tc.getInputData())
                            .expectedOutput(tc.getExpectedOutput())
                            .isHidden(tc.getIsHidden() != null ? tc.getIsHidden() : false)
                            .build())
                    .toList();
            codingTestCaseRepository.saveAll(testCases);
        }

        return mapToQuestionDto(savedQuestion);
    }

    public QuestionDto mapToQuestionDto(Question question) {
        List<QuestionOptionDto> optionDtos = questionOptionRepository.findByQuestionId(question.getId())
                .stream()
                .map(o -> QuestionOptionDto.builder()
                        .id(o.getId())
                        .optionText(o.getOptionText())
                        .isCorrect(o.getIsCorrect())
                        .explanation(o.getExplanation())
                        .build())
                .toList();

        List<CodingTestCaseDto> sampleTestCases = codingTestCaseRepository.findByQuestionIdAndIsHiddenFalse(question.getId())
                .stream()
                .map(tc -> CodingTestCaseDto.builder()
                        .id(tc.getId())
                        .inputData(tc.getInputData())
                        .expectedOutput(tc.getExpectedOutput())
                        .isHidden(false)
                        .build())
                .toList();

        String companyName = question.getCompanyId() != null ?
                companyRepository.findById(question.getCompanyId()).map(c -> c.getName()).orElse(null) : null;
        String roleName = question.getRoleId() != null ?
                jobRoleRepository.findById(question.getRoleId()).map(r -> r.getTitle()).orElse(null) : null;
        String roundName = question.getRoundId() != null ?
                roundRepository.findById(question.getRoundId()).map(r -> r.getName()).orElse(null) : null;
        String topicName = question.getTopicId() != null ?
                topicRepository.findById(question.getTopicId()).map(t -> t.getName()).orElse(null) : null;

        return QuestionDto.builder()
                .id(question.getId())
                .title(question.getTitle())
                .description(question.getDescription())
                .questionType(question.getQuestionType())
                .category(question.getCategory())
                .difficulty(question.getDifficulty())
                .companyId(question.getCompanyId())
                .companyName(companyName)
                .roleId(question.getRoleId())
                .roleName(roleName)
                .roundId(question.getRoundId())
                .roundName(roundName)
                .topicId(question.getTopicId())
                .topicName(topicName)
                .year(question.getYear())
                .starterCode(question.getStarterCode())
                .solution(question.getSolution())
                .constraints(question.getConstraints())
                .inputFormat(question.getInputFormat())
                .outputFormat(question.getOutputFormat())
                .explanation(question.getExplanation())
                .options(optionDtos)
                .sampleTestCases(sampleTestCases)
                .createdAt(question.getCreatedAt())
                .build();
    }
}
