package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.profile.LibraryCardResponse;
import com.example.demo.dto.profile.ProfileMeResponse;
import com.example.demo.dto.profile.ProfileMessageResponse;
import com.example.demo.dto.profile.UpdateProfileRequest;
import com.example.demo.service.ProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<ProfileMeResponse> me(@RequestParam(required = false) String username) {
        return ResponseEntity.ok(profileService.me(username));
    }

    @PatchMapping("/me")
    public ResponseEntity<ProfileMessageResponse> update(
            @RequestParam(required = false) String username,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(profileService.update(username, request));
    }

    @GetMapping("/library-card")
    public ResponseEntity<LibraryCardResponse> libraryCard(@RequestParam(required = false) String username) {
        return ResponseEntity.ok(profileService.libraryCard(username));
    }
}
