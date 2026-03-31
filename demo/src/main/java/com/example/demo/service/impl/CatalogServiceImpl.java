package com.example.demo.service.impl;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.demo.dto.catalog.CatalogBookDetailResponse;
import com.example.demo.dto.catalog.CatalogBookSearchResponse;
import com.example.demo.dto.catalog.CatalogHomeResponse;
import com.example.demo.dto.catalog.CatalogLocationMapResponse;
import com.example.demo.dto.catalog.CatalogReserveRequest;
import com.example.demo.dto.catalog.CatalogReserveResponse;
import com.example.demo.dto.catalog.CatalogShelfItemResponse;
import com.example.demo.dto.catalog.CatalogSimpleBookResponse;
import com.example.demo.mapper.CatalogMapper;
import com.example.demo.model.Book;
import com.example.demo.model.BookItem;
import com.example.demo.model.BookStatus;
import com.example.demo.model.BorrowRequestStatus;
import com.example.demo.model.User;
import com.example.demo.repository.BookItemRepository;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.BorrowRequestRepository;
import com.example.demo.service.CatalogService;
import com.example.demo.service.ModuleStateService;
import com.example.demo.service.UserContextService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CatalogServiceImpl implements CatalogService {

    private final BookRepository bookRepository;
    private final BookItemRepository bookItemRepository;
    private final BorrowRequestRepository borrowRequestRepository;
    private final ModuleStateService moduleStateService;
    private final UserContextService userContextService;
        private final CatalogMapper catalogMapper;

    @Override
    public CatalogHomeResponse home() {
        List<Book> books = bookRepository.findAll();
        List<CatalogSimpleBookResponse> newBooks = books.stream()
                .sorted(Comparator.comparing(Book::getId).reversed())
                .limit(6)
                .map(catalogMapper::toSimpleBook)
                .toList();
        return new CatalogHomeResponse(
                "Tìm theo tên sách, tác giả, ISBN",
                newBooks,
                newBooks,
                List.of("Tuần lễ sách công nghệ", "Sự kiện kỹ năng nghiên cứu học thuật"));
    }

    @Override
    public List<CatalogBookSearchResponse> search(String q, String author, String category, Integer publishYear, String status,
            Boolean digital) {
        return bookRepository.findAll().stream()
                .filter(book -> q == null || containsIgnoreCase(book.getTitle(), q) || containsIgnoreCase(book.getIsbn(), q))
                .filter(book -> author == null || book.getAuthors().stream().anyMatch(a -> containsIgnoreCase(a.getName(), author)))
                .filter(book -> category == null || (book.getCategory() != null
                        && containsIgnoreCase(book.getCategory().getName(), category)))
                .filter(book -> publishYear == null || book.getPublishYear() == publishYear)
                .filter(book -> digital == null || book.isDigital() == digital)
                .map(book -> {
                    long physicalAvailable = bookItemRepository.countByBookIdAndStatus(book.getId(), BookStatus.AVAILABLE);
                    long pendingRequests = borrowRequestRepository.countByStatusAndBookItemBookId(BorrowRequestStatus.PENDING, book.getId());
                    long availableItems = Math.max(0, physicalAvailable - pendingRequests);
                    String inventoryStatus = availableItems > 0 ? "AVAILABLE" : "UNAVAILABLE";
                    return catalogMapper.toBookSearchResponse(
                            book,
                            physicalAvailable,
                            pendingRequests,
                            availableItems,
                            inventoryStatus);
                })
                .filter(book -> status == null || Objects.equals(book.status(), status.toUpperCase()))
                .toList();
    }

    @Override
    public CatalogBookDetailResponse detail(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sách"));
        Optional<BookItem> firstItem = bookItemRepository.findByBookId(bookId).stream().findFirst();

        String location = firstItem
                .map(item -> item.getLocation() == null ? "N/A"
                        : item.getLocation().getRoomName() + " / Kệ " + item.getLocation().getShelfNumber())
                .orElse("N/A");

        return new CatalogBookDetailResponse(
                catalogMapper.toSimpleBook(book),
                book.getDescription(),
                book.getPublisher(),
                location);
    }

    @Override
    public CatalogLocationMapResponse locationMap(Long bookId) {
        List<BookItem> items = bookItemRepository.findByBookId(bookId);
        if (items.isEmpty() || items.get(0).getLocation() == null) {
            return new CatalogLocationMapResponse("N/A", "N/A", "Không có dữ liệu vị trí");
        }
        BookItem item = items.get(0);
        return new CatalogLocationMapResponse(
                item.getLocation().getRoomName(),
                item.getLocation().getShelfNumber(),
                "Đi thẳng 20m, rẽ trái tại khu vực " + item.getLocation().getRoomName());
    }

    @Override
    public CatalogReserveResponse reserve(Long bookId, CatalogReserveRequest request) {
        String username = request != null ? request.username() : null;
        User user = userContextService.resolveUser(username);
        moduleStateService.addToCart(user.getId(), bookId);
        return new CatalogReserveResponse("Đã thêm vào giỏ đặt mượn", bookId);
    }

    @Override
    public List<CatalogShelfItemResponse> shelves() {
        return bookItemRepository.findAll().stream()
                .filter(item -> item.getLocation() != null)
                .map(catalogMapper::toShelfItemResponse)
                .toList();
    }

    private boolean containsIgnoreCase(String source, String search) {
        return source != null && source.toLowerCase().contains(search.toLowerCase());
    }
}
