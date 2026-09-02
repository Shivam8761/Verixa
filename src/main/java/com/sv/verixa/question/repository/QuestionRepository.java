package com.sv.verixa.question.repository;

import com.sv.verixa.question.entity.Difficulty;
import com.sv.verixa.question.entity.Question;
import com.sv.verixa.question.entity.QuestionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID>, JpaSpecificationExecutor<Question> {
    List<Question> findByTopicIdAndActiveTrue(UUID topicId);
    List<Question> findByCompanyIdAndRoleIdAndRoundIdAndActiveTrue(UUID companyId, UUID roleId, UUID roundId);
    List<Question> findByCompanyIdIsNullAndActiveTrue();
    List<Question> findByTopicIdAndDifficultyAndActiveTrue(UUID topicId, Difficulty difficulty);
    List<Question> findByQuestionTypeAndActiveTrue(QuestionType questionType);
}
