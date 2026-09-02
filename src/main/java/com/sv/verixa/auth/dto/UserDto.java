package com.sv.verixa.auth.dto;

import com.sv.verixa.auth.entity.RoleEnum;
import lombok.*;

import java.time.ZonedDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private UUID id;
    private String email;
    private String fullName;
    private RoleEnum role;
    private UUID targetCompanyId;
    private String targetCompanyName;
    private UUID targetRoleId;
    private String targetRoleName;
    private Integer currentStreak;
    private Integer longestStreak;
    private ZonedDateTime createdAt;
}
