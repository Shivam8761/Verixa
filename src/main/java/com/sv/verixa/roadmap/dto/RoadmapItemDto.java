package com.sv.verixa.roadmap.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapItemDto {
    private UUID id;
    private Integer dayNumber;
    private String topicName;
    private String taskDescription;
    private Boolean isCompleted;
}
