package com.example.demo.dto.profile;

import java.time.LocalDateTime;
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
        Boolean membershipPaid,
        Integer membershipMaxBooks,
        Integer membershipBorrowDurationDays,
        Double membershipFineRatePerDay,
        String membershipPrivilegeNote,
        LocalDateTime membershipExpiresAt,
        Long membershipDaysRemaining,
        Long borrowingCount) {
}
