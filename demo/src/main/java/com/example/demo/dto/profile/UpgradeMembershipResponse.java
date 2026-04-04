package com.example.demo.dto.profile;

public record UpgradeMembershipResponse(
        String message,
        String fromPackage,
        String toPackage,
        boolean paid) {
}
