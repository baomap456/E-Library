package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        try {
            http
            .csrf(AbstractHttpConfigurer::disable) // Tắt CSRF vì chúng ta dùng JWT
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))    // Cấu hình CORS để React gọi API không bị chặn
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/error").permitAll()
                .requestMatchers("/ws/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/catalog/home", "/api/catalog/books", "/api/catalog/books/*", "/api/catalog/books/*/location-map", "/api/catalog/shelves").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/digital/documents", "/api/digital/documents/*/reader-config").permitAll()
                .requestMatchers("/api/librarian/**").hasAnyRole("LIBRARIAN", "ADMIN")
                .requestMatchers("/api/**").authenticated()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Không lưu session trên server
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
            return http.build();
        } catch (Exception ex) {
            throw new IllegalStateException("Không thể khởi tạo SecurityFilterChain", ex);
        }
    }

    // Công cụ băm mật khẩu (Không bao giờ lưu mật khẩu thô vào Database)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Quản lý việc xác thực
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) {
        try {
            return config.getAuthenticationManager();
        } catch (Exception ex) {
            throw new IllegalStateException("Không thể khởi tạo AuthenticationManager", ex);
        }
    }

    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Cho phép mọi nguồn (hoặc điền cụ thể "http://localhost:5173")
        configuration.addAllowedOriginPattern("*"); 
        configuration.addAllowedMethod("*"); // Cho phép GET, POST, PUT, DELETE...
        configuration.addAllowedHeader("*"); // Cho phép gửi mọi loại Header (kể cả Authorization)
        configuration.setAllowCredentials(true); 

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}


