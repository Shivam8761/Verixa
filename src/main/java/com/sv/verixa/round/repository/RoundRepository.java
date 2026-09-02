package com.sv.verixa.round.repository;

import com.sv.verixa.round.entity.Round;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RoundRepository extends JpaRepository<Round, UUID> {
    List<Round> findByRoleIdOrderByRoundOrderAsc(UUID roleId);
}
