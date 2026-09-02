package com.sv.verixa.topic.service;

import com.sv.verixa.topic.dto.TopicDto;
import com.sv.verixa.topic.entity.Topic;
import com.sv.verixa.topic.repository.TopicRepository;
import com.sv.verixa.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;

    @Transactional(readOnly = true)
    public List<TopicDto> getAllTopics() {
        return topicRepository.findAll().stream()
                .map(this::mapToTopicDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TopicDto> getTopicsByCategory(String category) {
        return topicRepository.findByCategory(category).stream()
                .map(this::mapToTopicDto)
                .toList();
    }

    @Transactional
    public TopicDto createTopic(TopicDto dto) {
        Topic topic = Topic.builder()
                .name(dto.getName())
                .category(dto.getCategory())
                .build();
        return mapToTopicDto(topicRepository.save(topic));
    }

    private TopicDto mapToTopicDto(Topic topic) {
        return TopicDto.builder()
                .id(topic.getId())
                .name(topic.getName())
                .category(topic.getCategory())
                .build();
    }
}
