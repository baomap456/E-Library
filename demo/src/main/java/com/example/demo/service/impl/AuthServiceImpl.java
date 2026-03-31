package com.example.demo.service.impl;

import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.mapper.AuthMapper;
import com.example.demo.model.MembershipType;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.MembershipTypeRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuthService;
import com.example.demo.service.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final MembershipTypeRepository membershipTypeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthMapper authMapper;

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Sai tài khoản hoặc mật khẩu");
        }

        String jwtToken = jwtService.generateToken(user);
        return authMapper.toAuthResponse(user, jwtToken);
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username đã tồn tại!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email đã được sử dụng!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setStudentId(request.getStudentId());
        user.setActive(true);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Role defaultRole = roleRepository.findByName("ROLE_MEMBER")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName("ROLE_MEMBER");
                    return roleRepository.save(role);
                });
        MembershipType defaultMembership = membershipTypeRepository.findByName("Free")
            .orElseGet(() -> {
                MembershipType membershipType = new MembershipType();
                membershipType.setName("Free");
                membershipType.setPaid(false);
                membershipType.setMaxBooks(3);
                membershipType.setBorrowDurationDays(14);
                membershipType.setFineRatePerDay(5000.0);
                membershipType.setPrivilegeNote("Goi mien phi phu hop nhu cau co ban");
                return membershipTypeRepository.save(membershipType);
            });
        user.setRoles(Set.of(defaultRole));
        user.setMembershipType(defaultMembership);

        userRepository.save(user);
        String jwtToken = jwtService.generateToken(user);
        return authMapper.toAuthResponse(user, jwtToken);
    }
}
