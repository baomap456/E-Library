package com.example.demo.dto.profile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpgradeMembershipRequest(
        @NotBlank(message = "targetPackage không được để trống")
        @Size(max = 100, message = "targetPackage tối đa 100 ký tự")
        String targetPackage,
        String paymentChannel) {
}
