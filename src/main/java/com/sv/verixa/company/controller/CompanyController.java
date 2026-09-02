package com.sv.verixa.company.controller;

import com.sv.verixa.company.dto.CompanyDto;
import com.sv.verixa.company.dto.JobRoleDto;
import com.sv.verixa.company.service.CompanyService;
import com.sv.verixa.round.dto.RoundDto;
import com.sv.verixa.round.service.RoundService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Companies & Roles", description = "Company, Job Role, and Selection Round APIs")
public class CompanyController {

    private final CompanyService companyService;
    private final RoundService roundService;

    @GetMapping("/companies")
    @Operation(summary = "Get all active target recruitment companies")
    public ResponseEntity<List<CompanyDto>> getCompanies() {
        return ResponseEntity.ok(companyService.getAllActiveCompanies());
    }

    @GetMapping("/companies/{id}")
    @Operation(summary = "Get company details by ID")
    public ResponseEntity<CompanyDto> getCompanyById(@PathVariable UUID id) {
        return ResponseEntity.ok(companyService.getCompanyById(id));
    }

    @GetMapping("/companies/{companyId}/roles")
    @Operation(summary = "Get all active job roles for a target company")
    public ResponseEntity<List<JobRoleDto>> getRolesForCompany(@PathVariable UUID companyId) {
        return ResponseEntity.ok(companyService.getJobRolesForCompany(companyId));
    }

    @GetMapping("/roles/{roleId}/rounds")
    @Operation(summary = "Get recruitment selection rounds for a specific job role")
    public ResponseEntity<List<RoundDto>> getRoundsForRole(@PathVariable UUID roleId) {
        return ResponseEntity.ok(roundService.getRoundsForRole(roleId));
    }
}
