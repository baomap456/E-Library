package com.example.demo.service.impl;

import org.springframework.stereotype.Service;

import com.example.demo.dto.profile.LibraryCardResponse;
import com.example.demo.dto.profile.ProfileMeResponse;
import com.example.demo.dto.profile.ProfileMessageResponse;
import com.example.demo.dto.profile.UpdateProfileRequest;
import com.example.demo.mapper.ProfileMapper;
import com.example.demo.model.User;
import com.example.demo.repository.BorrowRecordRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ProfileService;
import com.example.demo.service.UserContextService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserContextService userContextService;
    private final BorrowRecordRepository borrowRecordRepository;
    private final UserRepository userRepository;
    private final ProfileMapper profileMapper;

    @Override
    public ProfileMeResponse me(String username) {
        User user = userContextService.resolveUser(username);
        long borrowingCount = borrowRecordRepository.findByUserIdOrderByBorrowDateDesc(user.getId()).stream()
                .filter(record -> record.getReturnDate() == null)
                .count();

        return profileMapper.toProfileMeResponse(user, borrowingCount);
    }

    @Override
    public ProfileMessageResponse update(String username, UpdateProfileRequest request) {
        User user = userContextService.resolveUser(username);
        if (request.fullName() != null) {
            user.setFullName(request.fullName());
        }
        if (request.email() != null) {
            user.setEmail(request.email());
        }
        if (request.phone() != null) {
            user.setPhone(request.phone());
        }
        if (request.studentId() != null) {
            user.setStudentId(request.studentId());
        }
        userRepository.save(user);
        return new ProfileMessageResponse("Cập nhật hồ sơ thành công");
    }

    @Override
    public LibraryCardResponse libraryCard(String username) {
        User user = userContextService.resolveUser(username);
        return profileMapper.toLibraryCardResponse(user);
    }
}
