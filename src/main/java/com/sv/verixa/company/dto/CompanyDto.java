package com.sv.verixa.company.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyDto {
    private UUID id;
    private String name;
    private String logoUrl;
    private String description;
    private Boolean active;
}
