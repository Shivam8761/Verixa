package com.sv.verixa.company.repository;

import com.sv.verixa.company.entity.JobRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JobRoleRepository extends JpaRepository<JobRole, UUID> {
    List<JobRole> findByCompanyIdAndActiveTrue(UUID companyId);
}
