package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.profile.LibraryCardResponse;
import com.example.demo.dto.profile.MembershipPackageResponse;
import com.example.demo.dto.profile.MembershipTransactionResponse;
import com.example.demo.dto.profile.ProfileMeResponse;
import com.example.demo.dto.profile.ProfileMessageResponse;
import com.example.demo.dto.profile.UpdateProfileRequest;
import com.example.demo.dto.profile.UpgradeMembershipRequest;
import com.example.demo.dto.profile.UpgradeMembershipResponse;
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

    @GetMapping("/membership-packages")
    public ResponseEntity<List<MembershipPackageResponse>> membershipPackages() {
        return ResponseEntity.ok(profileService.membershipPackages());
    }

    @PostMapping("/membership/upgrade")
    public ResponseEntity<UpgradeMembershipResponse> upgradeMembership(
            @RequestParam(required = false) String username,
            @Valid @RequestBody UpgradeMembershipRequest request) {
        return ResponseEntity.ok(profileService.upgradeMembership(username, request));
    }
    
    @PostMapping("/membership/renew")
    public ResponseEntity<UpgradeMembershipResponse> renewMembership(
            @RequestParam(required = false) String username) {
        return ResponseEntity.ok(profileService.renewMembership(username));
    }
    
    @GetMapping("/membership/transactions")
    public ResponseEntity<List<MembershipTransactionResponse>> membershipTransactions(
            @RequestParam(required = false) String username) {
        return ResponseEntity.ok(profileService.membershipTransactions(username));
    }
}
