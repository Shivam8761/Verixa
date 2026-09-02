package com.sv.verixa.kafka.producer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaEventProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public static final String TOPIC_QUESTION_ATTEMPTED = "QUESTION_ATTEMPTED";
    public static final String TOPIC_CODING_SUBMISSION = "CODING_SUBMISSION_COMPLETED";
    public static final String TOPIC_CONTEST_COMPLETED = "CONTEST_COMPLETED";
    public static final String TOPIC_INTERVIEW_COMPLETED = "MOCK_INTERVIEW_COMPLETED";

    public void publishEvent(String topic, String key, String payload) {
        try {
            kafkaTemplate.send(topic, key, payload);
            log.info("Published event to Kafka topic {}: key={}", topic, key);
        } catch (Exception ex) {
            log.warn("Kafka event publishing skipped (Kafka broker unreachable): {}", ex.getMessage());
        }
    }
}
