package com.rms.controller;

import com.rms.dto.UserSettingsDto;
import com.rms.entity.User;
import com.rms.entity.UserSettings;
import com.rms.repository.UserRepository;
import com.rms.repository.UserSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    @Autowired
    private UserSettingsRepository userSettingsRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private UserSettings getOrCreateSettings(User user) {
        return userSettingsRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    UserSettings newSettings = new UserSettings();
                    newSettings.setUser(user);
                    return userSettingsRepository.save(newSettings);
                });
    }

    @GetMapping
    public ResponseEntity<UserSettingsDto> getSettings() {
        User user = getCurrentUser();
        UserSettings settings = getOrCreateSettings(user);
        
        UserSettingsDto dto = new UserSettingsDto();
        dto.setRolloffAlerts(settings.isRolloffAlerts());
        dto.setBenchThresholdAlerts(settings.isBenchThresholdAlerts());
        dto.setSkillGapWarnings(settings.isSkillGapWarnings());
        dto.setAllocationRequests(settings.isAllocationRequests());
        dto.setProjectDelayAlerts(settings.isProjectDelayAlerts());
        dto.setWeeklySummaryEmail(settings.isWeeklySummaryEmail());
        
        return ResponseEntity.ok(dto);
    }

    @PutMapping
    public ResponseEntity<UserSettingsDto> updateSettings(@RequestBody UserSettingsDto dto) {
        User user = getCurrentUser();
        UserSettings settings = getOrCreateSettings(user);
        
        settings.setRolloffAlerts(dto.isRolloffAlerts());
        settings.setBenchThresholdAlerts(dto.isBenchThresholdAlerts());
        settings.setSkillGapWarnings(dto.isSkillGapWarnings());
        settings.setAllocationRequests(dto.isAllocationRequests());
        settings.setProjectDelayAlerts(dto.isProjectDelayAlerts());
        settings.setWeeklySummaryEmail(dto.isWeeklySummaryEmail());
        
        userSettingsRepository.save(settings);
        
        return ResponseEntity.ok(dto);
    }
}
