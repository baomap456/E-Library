package com.example.demo.dto.librarian;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LibrarianGuestCheckoutRequest(
        @NotBlank(message = "guestName không được để trống")
        @Size(max = 100, message = "guestName tối đa 100 ký tự")
        String guestName,
        @Size(max = 30, message = "phone tối đa 30 ký tự")
        String phone,
        @NotBlank(message = "borrowMode không được để trống")
        @Size(max = 30, message = "borrowMode tối đa 30 ký tự")
        String borrowMode,
        Double depositAmount,
        @Size(max = 20, message = "citizenId tối đa 20 ký tự")
        String citizenId,
        @NotBlank(message = "barcode không được để trống")
        @Size(max = 100, message = "barcode tối đa 100 ký tự")
        String barcode) {
}
