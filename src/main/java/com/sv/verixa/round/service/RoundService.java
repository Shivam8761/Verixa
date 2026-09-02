package com.sv.verixa.round.service;

import com.sv.verixa.round.dto.RoundDto;
import com.sv.verixa.round.entity.Round;
import com.sv.verixa.round.repository.RoundRepository;
import com.sv.verixa.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoundService {

    private final RoundRepository roundRepository;

    @Transactional(readOnly = true)
    public List<RoundDto> getRoundsForRole(UUID roleId) {
        return roundRepository.findByRoleIdOrderByRoundOrderAsc(roleId).stream()
                .map(this::mapToRoundDto)
                .toList();
    }

    @Transactional
    public RoundDto createRound(RoundDto dto) {
        Round round = Round.builder()
                .roleId(dto.getRoleId())
                .name(dto.getName())
                .roundOrder(dto.getRoundOrder())
                .build();
        return mapToRoundDto(roundRepository.save(round));
    }

    private RoundDto mapToRoundDto(Round round) {
        return RoundDto.builder()
                .id(round.getId())
                .roleId(round.getRoleId())
                .name(round.getName())
                .roundOrder(round.getRoundOrder())
                .build();
    }
}
