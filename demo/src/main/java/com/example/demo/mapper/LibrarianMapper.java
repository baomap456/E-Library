package com.example.demo.mapper;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.example.demo.dto.librarian.LibrarianBookResponse;
import com.example.demo.dto.librarian.LibrarianIncidentResponse;
import com.example.demo.dto.librarian.LibrarianLocationResponse;
import com.example.demo.dto.librarian.LibrarianRenewalRequestResponse;
import com.example.demo.model.Book;
import com.example.demo.model.BorrowRecord;
import com.example.demo.model.Location;

@Component
public class LibrarianMapper {

    public LibrarianBookResponse toBookResponse(Book book) {
        return new LibrarianBookResponse(
                book.getId(),
                book.getTitle(),
                book.getDescription(),
                book.getPublishYear(),
                book.getPublisher(),
                book.getCoverImageUrl(),
                book.isDigital());
    }

    public LibrarianLocationResponse toLocationResponse(Location location) {
        return new LibrarianLocationResponse(location.getId(), location.getRoomName(), location.getShelfNumber());
    }

    public LibrarianRenewalRequestResponse toRenewalRequestResponse(BorrowRecord record) {
        return new LibrarianRenewalRequestResponse(
                record.getId(),
                record.getUser().getUsername(),
                record.getBookItem().getBook().getTitle(),
                record.getDueDate(),
                "PENDING");
    }

    public LibrarianIncidentResponse toIncidentResponse(Map<String, Object> map) {
        Long id = map.get("id") instanceof Number number ? number.longValue() : null;
        LocalDateTime createdAt = map.get("createdAt") instanceof LocalDateTime dateTime ? dateTime : null;
        String detail = String.valueOf(map.getOrDefault("detail", ""));
        return new LibrarianIncidentResponse(id, detail, createdAt);
    }
}
