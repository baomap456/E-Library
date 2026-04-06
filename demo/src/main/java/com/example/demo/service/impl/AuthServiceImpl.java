package com.example.demo.service.impl;

import java.security.SecureRandom;
import java.util.Set;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.ForgotPasswordRequest;
import com.example.demo.dto.ForgotPasswordResponse;
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
    private static final SecureRandom RANDOM = new SecureRandom();

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Sai tài khoản hoặc mật khẩu"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Sai tài khoản hoặc mật khẩu");
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

        Role defaultRole = roleRepository.findByName("MEMBER")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName("MEMBER");
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

    @Override
    public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {
        String identifier = request.getIdentifier() == null ? "" : request.getIdentifier().trim();
        User user = userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản phù hợp"));

        String tempPassword = generateTempPassword();
        user.setPassword(passwordEncoder.encode(tempPassword));
        userRepository.save(user);

        return new ForgotPasswordResponse(
                "Mật khẩu tạm thời đã được tạo. Hãy đăng nhập lại bằng mật khẩu mới này và đổi mật khẩu sau khi vào hệ thống.",
                tempPassword);
    }

    private String generateTempPassword() {
        String alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            builder.append(alphabet.charAt(RANDOM.nextInt(alphabet.length())));
        }
        return builder.toString();
    }
}
