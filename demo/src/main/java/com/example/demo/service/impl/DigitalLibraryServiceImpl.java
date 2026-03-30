package com.example.demo.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.dto.digital.DigitalDocumentResponse;
import com.example.demo.dto.digital.DigitalReaderConfigResponse;
import com.example.demo.mapper.DigitalMapper;
import com.example.demo.model.Book;
import com.example.demo.repository.BookRepository;
import com.example.demo.service.DigitalLibraryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DigitalLibraryServiceImpl implements DigitalLibraryService {

    private final BookRepository bookRepository;
    private final DigitalMapper digitalMapper;

    @Override
    public List<DigitalDocumentResponse> documents(Integer publishYear, String q) {
        return bookRepository.findByIsDigitalTrue().stream()
                .filter(book -> publishYear == null || book.getPublishYear() == publishYear)
                .filter(book -> q == null || containsIgnoreCase(book.getTitle(), q))
            .map(digitalMapper::toDocumentResponse)
                .toList();
    }

    @Override
    public DigitalReaderConfigResponse readerConfig(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài liệu số"));
        return digitalMapper.toReaderConfigResponse(bookId, book);
    }

    private boolean containsIgnoreCase(String source, String search) {
        return source != null && source.toLowerCase().contains(search.toLowerCase());
    }
}
