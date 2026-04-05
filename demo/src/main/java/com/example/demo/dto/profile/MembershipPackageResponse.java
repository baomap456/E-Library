package com.example.demo.dto.profile;

import java.util.List;

public record MembershipPackageResponse(
        Integer id,
        String name,
        boolean paid,
        Double price,
        Integer maxBooks,
        Integer borrowDurationDays,
        Double fineRatePerDay,
        String privilegeNote,
        List<String> benefits) {
}
