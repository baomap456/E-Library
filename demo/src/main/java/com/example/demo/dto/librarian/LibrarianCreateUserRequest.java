package com.example.demo.dto.librarian;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LibrarianCreateUserRequest(
        @NotBlank(message = "username không được để trống")
        @Size(min = 4, max = 50, message = "username phải từ 4 đến 50 ký tự")
        String username,
        @NotBlank(message = "mật khẩu không được để trống")
        @Size(min = 6, max = 100, message = "mật khẩu phải từ 6 đến 100 ký tự")
        String password,
        @NotBlank(message = "email không được để trống")
        @Email(message = "email không đúng định dạng")
        @Size(max = 100, message = "email tối đa 100 ký tự")
        String email,
        @NotBlank(message = "họ tên không được để trống")
        @Size(max = 100, message = "họ tên tối đa 100 ký tự")
        String fullName,
        @Size(max = 50, message = "mã sinh viên tối đa 50 ký tự")
        String studentId) {
}
