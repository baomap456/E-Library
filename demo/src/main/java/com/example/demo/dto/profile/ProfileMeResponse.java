package com.example.demo.dto.profile;

import java.util.List;

public record ProfileMeResponse(
        Long id,
        String username,
        String fullName,
        String email,
        String studentId,
        String phone,
        List<String> roles,
        String membership,
        Long borrowingCount) {
}
