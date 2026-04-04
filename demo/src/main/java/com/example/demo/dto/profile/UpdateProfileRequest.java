package com.example.demo.dto.profile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Size(max = 120, message = "fullName tối đa 120 ký tự")
        String fullName,
        @Email(message = "Email không đúng định dạng")
        @Size(max = 255, message = "email tối đa 255 ký tự")
        String email,
        @Size(max = 30, message = "phone tối đa 30 ký tự")
        String phone,
        @Size(max = 50, message = "studentId tối đa 50 ký tự")
        String studentId) {
}
