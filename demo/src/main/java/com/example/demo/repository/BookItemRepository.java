package com.example.demo.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.model.BookItem;
import com.example.demo.model.BookStatus;

public interface BookItemRepository extends JpaRepository<BookItem, Long> {
    List<BookItem> findByBookId(Long bookId);

    List<BookItem> findByBookIdAndStatusNot(Long bookId, BookStatus status);

    long countByBookIdAndStatus(Long bookId, BookStatus status);

    long countByBookIdAndStatusNot(Long bookId, BookStatus status);

    long countByStatusIn(Collection<BookStatus> statuses);

    Optional<BookItem> findFirstByBookIdAndStatus(Long bookId, BookStatus status);

    Optional<BookItem> findByBarcode(String barcode);

    List<BookItem> findByBarcodeIn(List<String> barcodes);

    List<BookItem> findByStatusNot(BookStatus status);

    List<BookItem> findByBookIdIn(List<Long> bookIds);

    @Modifying
    @Query("update BookItem bi set bi.status = :status where bi.book.id in :bookIds")
    int bulkUpdateStatusByBookIds(@Param("bookIds") List<Long> bookIds, @Param("status") BookStatus status);
}
