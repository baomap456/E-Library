package com.example.demo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuthService;

@SpringBootTest
@Transactional // Đảm bảo test xong thì xóa dữ liệu rác đi, không làm bẩn Database thật
@ActiveProfiles("test")
public class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void thu_dang_ky_thanh_cong_se_luu_vao_database() {
        // 1. Chuẩn bị dữ liệu mẫu (Giả lập người dùng nhập Form)
        RegisterRequest request = new RegisterRequest();
        request.setUsername("teststudent");
        request.setPassword("MatKhauSieuKho123");
        request.setEmail("student@dnck.com");
        request.setFullName("Sinh Vien Test");

        // 2. Chạy hàm Đăng ký
        authService.register(request);

        // 3. Kiểm tra xem Database có thực sự lưu không
        User savedUser = userRepository.findByUsername("teststudent").orElse(null);
        
        // Các bài chấm điểm:
        assertThat(savedUser).isNotNull(); // Phải tìm thấy User
        assertThat(savedUser.getEmail()).isEqualTo("student@dnck.com"); // Email phải khớp
        assertThat(savedUser.getPassword()).isNotEqualTo("MatKhauSieuKho123"); // Mật khẩu PHẢI BỊ MÃ HOÁ (Không được giống pass gốc)
    }

    @Test
    void thu_dang_nhap_thanh_cong_se_tra_ve_token_hop_le() {
        // 1. Chuẩn bị: Đăng ký 1 user hợp lệ vào DB ảo
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setUsername("nguyenvana");
        registerReq.setPassword("PassKhoDoan123");
        registerReq.setEmail("nva@dnck.com");
        registerReq.setFullName("Nguyen Van A");
        authService.register(registerReq);

        // 2. Thực thi: Nhập form Đăng nhập với đúng pass đó
        LoginRequest loginReq = new LoginRequest();
        loginReq.setUsername("nguyenvana");
        loginReq.setPassword("PassKhoDoan123");
        
        AuthResponse response = authService.login(loginReq);

        // 3. Chấm điểm: Phải có Token trả về, và đúng tên người dùng
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isNotBlank(); // Token không được rỗng
        assertThat(response.getUsername()).isEqualTo("nguyenvana");
    }

    @Test
    void thu_dang_nhap_sai_mat_khau_se_bi_tu_choi() {
        // 1. Chuẩn bị: Vẫn đăng ký 1 user hợp lệ
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setUsername("nguyenvanb");
        registerReq.setPassword("PassKhoDoan123");
        registerReq.setEmail("nvb@dnck.com");
        registerReq.setFullName("Nguyen Van B");
        authService.register(registerReq);

        // 2. Thực thi: Kẻ gian cố tình nhập sai mật khẩu
        LoginRequest hackerReq = new LoginRequest();
        hackerReq.setUsername("nguyenvanb");
        hackerReq.setPassword("MatKhauTaLao");

        // 3. Chấm điểm: Bắt buộc Spring Security phải quăng ra lỗi (Exception), nếu không quăng lỗi là hệ thống hỏng!
        assertThrows(Exception.class, () -> {
            authService.login(hackerReq);
        });
    }
}