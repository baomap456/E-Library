package com.example.demo.mapper;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.example.demo.dto.profile.LibraryCardResponse;
import com.example.demo.dto.profile.MembershipPackageResponse;
import com.example.demo.dto.profile.MembershipTransactionResponse;
import com.example.demo.dto.profile.ProfileMeResponse;
import com.example.demo.model.MembershipTransaction;
import com.example.demo.model.MembershipType;
import com.example.demo.model.User;

@Component
public class ProfileMapper {

    public ProfileMeResponse toProfileMeResponse(User user, long borrowingCount) {
        MembershipType membershipType = user.getMembershipType();
        Long daysRemaining = null;
        if (user.getMembershipExpiresAt() != null) {
            daysRemaining = ChronoUnit.DAYS.between(LocalDateTime.now(), user.getMembershipExpiresAt());
        }
        return new ProfileMeResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName() == null ? "" : user.getFullName(),
                user.getEmail() == null ? "" : user.getEmail(),
                user.getStudentId() == null ? "" : user.getStudentId(),
                user.getPhone() == null ? "" : user.getPhone(),
                user.getRoles().stream().map(role -> role.getName()).toList(),
                membershipType != null ? membershipType.getName() : "Free",
                membershipType != null && membershipType.isPaid(),
                membershipType != null ? membershipType.getMaxBooks() : 3,
                membershipType != null ? membershipType.getBorrowDurationDays() : 14,
                membershipType != null ? membershipType.getFineRatePerDay() : 5000.0,
                membershipType != null ? membershipType.getPrivilegeNote() : "Goi co ban khong phi",
                user.getMembershipExpiresAt(),
                daysRemaining,
                borrowingCount);
    }

    public MembershipPackageResponse toMembershipPackageResponse(MembershipType membershipType, double price) {
        return new MembershipPackageResponse(
                membershipType.getId(),
                membershipType.getName(),
                membershipType.isPaid(),
                price,
                membershipType.getMaxBooks(),
                membershipType.getBorrowDurationDays(),
                membershipType.getFineRatePerDay(),
                membershipType.getPrivilegeNote(),
                buildBenefits(membershipType));
    }

    private List<String> buildBenefits(MembershipType membershipType) {
        List<String> benefits = new ArrayList<>();
        benefits.add("Muon toi da " + membershipType.getMaxBooks() + " sach");
        benefits.add("Thoi han muon " + membershipType.getBorrowDurationDays() + " ngay");
        benefits.add("Phi tre han " + String.format("%.0f", membershipType.getFineRatePerDay()) + " VND/ngay");
        if (membershipType.isPaid()) {
            benefits.add("Uu tien dat cho truoc");
            benefits.add("Truy cap tai lieu so nang cao");
        } else {
            benefits.add("Truy cap tai lieu so co ban");
        }
        return benefits;
    }

    public LibraryCardResponse toLibraryCardResponse(User user) {
        String cardCode = "LIB-" + user.getUsername().toUpperCase() + "-2026";
        return new LibraryCardResponse(cardCode, cardCode, "2026-12-31");
    }

    public MembershipTransactionResponse toMembershipTransactionResponse(MembershipTransaction transaction) {
        return new MembershipTransactionResponse(
                transaction.getId(),
                transaction.getActorUsername(),
                transaction.getPaymentChannel(),
                transaction.getAction(),
                transaction.getFromPackage(),
                transaction.getToPackage(),
                transaction.getAmount(),
                transaction.getNote(),
                transaction.getCreatedAt());
    }
}
