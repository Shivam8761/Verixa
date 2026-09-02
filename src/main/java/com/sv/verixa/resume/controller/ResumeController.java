package com.sv.verixa.resume.controller;

import com.sv.verixa.auth.entity.User;
import com.sv.verixa.auth.service.AuthService;
import com.sv.verixa.resume.dto.ResumeAnalysisDto;
import com.sv.verixa.resume.service.ResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
@Tag(name = "Resume Analysis", description = "PDF Resume parsing using Apache PDFBox & AI target company skill match")
public class ResumeController {

    private final ResumeService resumeService;
    private final AuthService authService;

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload PDF resume and receive structured skill analysis")
    public ResponseEntity<ResumeAnalysisDto> analyzeResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "companyId", required = false) UUID companyId,
            @RequestParam(value = "roleId", required = false) UUID roleId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        ResumeAnalysisDto result = resumeService.analyzeResume(user, file, companyId, roleId);
        return ResponseEntity.ok(result);
    }
}
