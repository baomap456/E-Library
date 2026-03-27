package com.example.demo.service;


import java.util.Set;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder; // Công cụ băm mật khẩu
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request) {
        // 1. Nhờ Spring Security kiểm tra username và password
        // Nếu sai mật khẩu, hàm này sẽ tự động ném ra lỗi (Exception) và dừng lại luôn
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // 2. Nếu đi qua được bước 1, tức là pass đúng. Ta lấy thông tin User từ DB lên.
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng"));

        // 3. In thẻ JWT mới cho người dùng
        String jwtToken = jwtService.generateToken(user);

        // 4. Đóng gói Token và trả về cho Frontend
        return AuthResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .fullName(user.getFullName())
                .build();
    }

    public AuthResponse register(RegisterRequest request) {
        // 1. Kiểm tra trùng lặp (Validation)
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username đã tồn tại!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email đã được sử dụng!");
        }

        // 2. Tạo đối tượng User mới
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setStudentId(request.getStudentId());
        user.setActive(true);

        // 🚀 BƯỚC QUAN TRỌNG NHẤT: MÃ HOÁ MẬT KHẨU BẰNG BCRYPT
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // 3. Gán quyền mặc định (MEMBER)
        Role defaultRole = roleRepository.findByName("ROLE_MEMBER")
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy Role mặc định trong DB."));
        user.setRoles(Set.of(defaultRole));

        // 4. Lưu xuống Database
        userRepository.save(user);

        // 5. (Tùy chọn) In thẻ JWT luôn để người dùng đăng nhập ngay lập tức
        String jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .fullName(user.getFullName())
                .build();
    }
    
    // ... (Hàm authenticate của luồng Login bạn viết sau)
}
