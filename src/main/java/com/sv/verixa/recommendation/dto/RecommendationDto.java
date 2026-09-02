package com.sv.verixa.recommendation.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationDto {
    private UUID id;
    private UUID topicId;
    private String topicName;
    private String title;
    private String description;
    private String recommendationType;
}
