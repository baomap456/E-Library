package com.example.demo.service;

import java.util.List;

import com.example.demo.dto.profile.LibraryCardResponse;
import com.example.demo.dto.profile.MembershipPackageResponse;
import com.example.demo.dto.profile.MembershipTransactionResponse;
import com.example.demo.dto.profile.ProfileMeResponse;
import com.example.demo.dto.profile.ProfileMessageResponse;
import com.example.demo.dto.profile.UpdateProfileRequest;
import com.example.demo.dto.profile.UpgradeMembershipRequest;
import com.example.demo.dto.profile.UpgradeMembershipResponse;

public interface ProfileService {
    ProfileMeResponse me(String username);

    ProfileMessageResponse update(String username, UpdateProfileRequest request);

    LibraryCardResponse libraryCard(String username);

    List<MembershipPackageResponse> membershipPackages();

    UpgradeMembershipResponse upgradeMembership(String username, UpgradeMembershipRequest request);

    UpgradeMembershipResponse renewMembership(String username);

    List<MembershipTransactionResponse> membershipTransactions(String username);
}
