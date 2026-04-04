package com.example.demo.dto.librarian;

public record LibrarianDashboardResponse(
        Long totalBooks,
        Long borrowingNow,
        Long borrowingsToday) {
}
