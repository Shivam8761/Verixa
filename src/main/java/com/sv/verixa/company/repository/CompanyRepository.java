package com.sv.verixa.company.repository;

import com.sv.verixa.company.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompanyRepository extends JpaRepository<Company, UUID> {
    List<Company> findByActiveTrue();
    Optional<Company> findByNameIgnoreCase(String name);
}
