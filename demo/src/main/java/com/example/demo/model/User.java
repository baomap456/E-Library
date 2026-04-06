package com.example.demo.model;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    private String fullName;
    private String studentId;
    private String phone;
    private boolean active = true;
    private Double outstandingDebt = 0.0;
    private boolean borrowingLocked = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "membership_type_id")
    private MembershipType membershipType;

    @Column(name = "membership_activated_at")
    private LocalDateTime membershipActivatedAt;

    @Column(name = "membership_expires_at")
    private LocalDateTime membershipExpiresAt;

    @Column(name = "membership_reminder_sent_at")
    private LocalDateTime membershipReminderSentAt;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(Role::getName)
                .filter(name -> name != null && !name.isBlank())
                .map(name -> name.startsWith("ROLE_") ? name : "ROLE_" + name)
                .map(SimpleGrantedAuthority::new)
            .toList();
    }

    // Spring hỏi: Tài khoản có bị hết hạn không? -> Trả lời: Không (true)
    @Override
    public boolean isAccountNonExpired() {
        return true; 
    }

    // Spring hỏi: Tài khoản có bị khóa không? -> Trả lời: Không (true)
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    // Spring hỏi: Mật khẩu có bị hết hạn không? -> Trả lời: Không (true)
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // Spring hỏi: Tài khoản này có đang kích hoạt không? -> Lấy biến active của bạn ra trả lời
    @Override
    public boolean isEnabled() {
        return active;
    }
}
