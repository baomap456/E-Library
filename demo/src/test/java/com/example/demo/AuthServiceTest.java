package com.example.demo;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuthService;

@SpringBootTest
@Transactional // Đảm bảo test xong thì xóa dữ liệu rác đi, không làm bẩn Database thật
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
}