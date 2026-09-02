package com.sv.verixa.contest.dto;

import com.sv.verixa.question.dto.QuestionDto;
import lombok.*;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContestDto {
    private UUID id;
    private String title;
    private String description;
    private ZonedDateTime startTime;
    private ZonedDateTime endTime;
    private Integer durationMinutes;
    private String status;
    private List<QuestionDto> questions;
}
