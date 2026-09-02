package com.sv.verixa.round.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoundDto {
    private UUID id;
    private UUID roleId;
    private String name;
    private Integer roundOrder;
}
