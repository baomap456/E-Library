package com.example.demo.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.example.demo.dto.digital.DigitalDocumentResponse;
import com.example.demo.dto.digital.DigitalReaderConfigResponse;
import com.example.demo.model.Book;

@Component
public class DigitalMapper {

    public DigitalDocumentResponse toDocumentResponse(Book book) {
        return new DigitalDocumentResponse(
                book.getId(),
                book.getTitle(),
                book.getPublishYear(),
                book.getDescription() == null ? "" : book.getDescription(),
                "PDF");
    }

    public DigitalReaderConfigResponse toReaderConfigResponse(Long bookId, Book book) {
        return new DigitalReaderConfigResponse(
                bookId,
                book.getTitle(),
                true,
                false,
                false,
                List.of("zoom-in", "zoom-out", "table-of-contents", "search"));
    }
}
