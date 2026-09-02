package com.sv.verixa.topic.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopicDto {
    private UUID id;
    private String name;
    private String category;
}
