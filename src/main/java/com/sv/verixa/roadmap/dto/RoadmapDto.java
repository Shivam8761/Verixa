package com.sv.verixa.roadmap.dto;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapDto {
    private UUID id;
    private UUID companyId;
    private String companyName;
    private UUID roleId;
    private String roleTitle;
    private Integer durationDays;
    private List<RoadmapItemDto> items;
}
