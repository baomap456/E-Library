package com.example.demo.mapper;

import org.springframework.stereotype.Component;

import com.example.demo.dto.profile.LibraryCardResponse;
import com.example.demo.dto.profile.ProfileMeResponse;
import com.example.demo.model.User;

@Component
public class ProfileMapper {

    public ProfileMeResponse toProfileMeResponse(User user, long borrowingCount) {
        return new ProfileMeResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName() == null ? "" : user.getFullName(),
                user.getEmail() == null ? "" : user.getEmail(),
                user.getStudentId() == null ? "" : user.getStudentId(),
                user.getPhone() == null ? "" : user.getPhone(),
                user.getRoles().stream().map(role -> role.getName()).toList(),
                "Student Premium",
                borrowingCount);
    }

    public LibraryCardResponse toLibraryCardResponse(User user) {
        String cardCode = "LIB-" + user.getUsername().toUpperCase() + "-2026";
        return new LibraryCardResponse(cardCode, cardCode, "2026-12-31");
    }
}
