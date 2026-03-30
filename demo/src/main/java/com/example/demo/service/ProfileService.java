package com.example.demo.service;

import com.example.demo.dto.profile.LibraryCardResponse;
import com.example.demo.dto.profile.ProfileMeResponse;
import com.example.demo.dto.profile.ProfileMessageResponse;
import com.example.demo.dto.profile.UpdateProfileRequest;

public interface ProfileService {
    ProfileMeResponse me(String username);

    ProfileMessageResponse update(String username, UpdateProfileRequest request);

    LibraryCardResponse libraryCard(String username);
}
