package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable) // Tắt CSRF vì chúng ta dùng JWT
            .cors(AbstractHttpConfigurer::disable)    // Cấu hình CORS để React gọi API không bị chặn
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll() // Mở cửa tự do cho Đăng nhập/Đăng ký
                .requestMatchers("/api/v1/public/**").permitAll() // Các API public (xem danh sách sách)
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN") // Chỉ Admin được vào
                .anyRequest().authenticated() // Tất cả các request khác phải có thẻ (Token)
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Không lưu session trên server
            );

        // Chú ý: Ở bước sau chúng ta sẽ thêm JwtFilter vào đây

        return http.build();
    }

    // Công cụ băm mật khẩu (Không bao giờ lưu mật khẩu thô vào Database)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Quản lý việc xác thực
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
