package com.example.demo.dto.librarian;

public record LibrarianUpgradeAccountResponse(
        String message,
        String username,
        String fromPackage,
        String toPackage,
        boolean paidPackage) {
}
