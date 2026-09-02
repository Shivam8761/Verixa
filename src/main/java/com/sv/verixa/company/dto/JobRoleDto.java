package com.sv.verixa.company.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRoleDto {
    private UUID id;
    private UUID companyId;
    private String title;
    private String description;
    private Boolean active;
}
