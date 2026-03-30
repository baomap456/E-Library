package com.example.demo.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findFirstByOrderByIdAsc();
    
    // Thêm 2 hàm này để check trùng lặp khi đăng ký
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
