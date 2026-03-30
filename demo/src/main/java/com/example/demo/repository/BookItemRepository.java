package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.BookItem;
import com.example.demo.model.BookStatus;

public interface BookItemRepository extends JpaRepository<BookItem, Long> {
    List<BookItem> findByBookId(Long bookId);

    long countByBookIdAndStatus(Long bookId, BookStatus status);

    Optional<BookItem> findFirstByBookIdAndStatus(Long bookId, BookStatus status);

    Optional<BookItem> findByBarcode(String barcode);
}
