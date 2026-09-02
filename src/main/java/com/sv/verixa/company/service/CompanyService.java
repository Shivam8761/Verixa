package com.sv.verixa.company.service;

import com.sv.verixa.company.dto.CompanyDto;
import com.sv.verixa.company.dto.JobRoleDto;
import com.sv.verixa.company.entity.Company;
import com.sv.verixa.company.entity.JobRole;
import com.sv.verixa.company.repository.CompanyRepository;
import com.sv.verixa.company.repository.JobRoleRepository;
import com.sv.verixa.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final JobRoleRepository jobRoleRepository;

    @Transactional(readOnly = true)
    public List<CompanyDto> getAllActiveCompanies() {
        return companyRepository.findByActiveTrue().stream()
                .map(this::mapToCompanyDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public CompanyDto getCompanyById(UUID id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
        return mapToCompanyDto(company);
    }

    @Transactional(readOnly = true)
    public List<JobRoleDto> getJobRolesForCompany(UUID companyId) {
        return jobRoleRepository.findByCompanyIdAndActiveTrue(companyId).stream()
                .map(this::mapToJobRoleDto)
                .toList();
    }

    @Transactional
    public CompanyDto createCompany(CompanyDto dto) {
        Company company = Company.builder()
                .name(dto.getName())
                .logoUrl(dto.getLogoUrl())
                .description(dto.getDescription())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();
        return mapToCompanyDto(companyRepository.save(company));
    }

    @Transactional
    public JobRoleDto createJobRole(JobRoleDto dto) {
        JobRole role = JobRole.builder()
                .companyId(dto.getCompanyId())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();
        return mapToJobRoleDto(jobRoleRepository.save(role));
    }

    private CompanyDto mapToCompanyDto(Company company) {
        return CompanyDto.builder()
                .id(company.getId())
                .name(company.getName())
                .logoUrl(company.getLogoUrl())
                .description(company.getDescription())
                .active(company.getActive())
                .build();
    }

    private JobRoleDto mapToJobRoleDto(JobRole role) {
        return JobRoleDto.builder()
                .id(role.getId())
                .companyId(role.getCompanyId())
                .title(role.getTitle())
                .description(role.getDescription())
                .active(role.getActive())
                .build();
    }
}
