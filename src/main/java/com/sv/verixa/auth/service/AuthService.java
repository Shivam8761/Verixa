package com.sv.verixa.auth.service;

import com.sv.verixa.auth.dto.*;
import com.sv.verixa.auth.entity.RoleEnum;
import com.sv.verixa.auth.entity.User;
import com.sv.verixa.auth.entity.UserStreak;
import com.sv.verixa.auth.repository.UserRepository;
import com.sv.verixa.auth.repository.UserStreakRepository;
import com.sv.verixa.auth.security.JwtTokenProvider;
import com.sv.verixa.common.exception.BadRequestException;
import com.sv.verixa.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserStreakRepository userStreakRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(RoleEnum.USER)
                .targetCompanyId(request.getTargetCompanyId())
                .targetRoleId(request.getTargetRoleId())
                .build();

        User savedUser = userRepository.save(user);

        // Initialize User Streak
        UserStreak streak = UserStreak.builder()
                .userId(savedUser.getId())
                .currentStreak(1)
                .longestStreak(1)
                .lastActivityDate(LocalDate.now())
                .build();
        userStreakRepository.save(streak);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication, savedUser.getId());
        UserDto userDto = mapToUserDto(savedUser, streak);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(userDto)
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserStreak streak = userStreakRepository.findByUserId(user.getId())
                .orElse(UserStreak.builder().currentStreak(0).longestStreak(0).build());

        String token = tokenProvider.generateToken(authentication, user.getId());
        UserDto userDto = mapToUserDto(user, streak);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(userDto)
                .build();
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUserDto(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        UserStreak streak = userStreakRepository.findByUserId(user.getId())
                .orElse(UserStreak.builder().currentStreak(0).longestStreak(0).build());

        return mapToUserDto(user, streak);
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private UserDto mapToUserDto(User user, UserStreak streak) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .targetCompanyId(user.getTargetCompanyId())
                .targetRoleId(user.getTargetRoleId())
                .currentStreak(streak != null ? streak.getCurrentStreak() : 0)
                .longestStreak(streak != null ? streak.getLongestStreak() : 0)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
