package com.example.demo.service.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.demo.dto.librarian.LibrarianApproveRenewResponse;
import com.example.demo.dto.librarian.LibrarianAuthorRequest;
import com.example.demo.dto.librarian.LibrarianAuthorResponse;
import com.example.demo.dto.librarian.LibrarianBookRequest;
import com.example.demo.dto.librarian.LibrarianBookResponse;
import com.example.demo.dto.librarian.LibrarianCategoryRequest;
import com.example.demo.dto.librarian.LibrarianCategoryResponse;
import com.example.demo.dto.librarian.LibrarianCheckinRequest;
import com.example.demo.dto.librarian.LibrarianCheckinResponse;
import com.example.demo.dto.librarian.LibrarianCheckoutRequest;
import com.example.demo.dto.librarian.LibrarianCheckoutResponse;
import com.example.demo.dto.librarian.LibrarianDashboardResponse;
import com.example.demo.dto.librarian.LibrarianDebtorResponse;
import com.example.demo.dto.librarian.LibrarianDeleteBookResponse;
import com.example.demo.dto.librarian.LibrarianIncidentRequest;
import com.example.demo.dto.librarian.LibrarianIncidentResponse;
import com.example.demo.dto.librarian.LibrarianLocationRequest;
import com.example.demo.dto.librarian.LibrarianLocationResponse;
import com.example.demo.dto.librarian.LibrarianRejectRenewResponse;
import com.example.demo.dto.librarian.LibrarianRenewalRequestResponse;
import com.example.demo.mapper.LibrarianMapper;
import com.example.demo.model.Author;
import com.example.demo.model.Book;
import com.example.demo.model.BookItem;
import com.example.demo.model.BookStatus;
import com.example.demo.model.BorrowRecord;
import com.example.demo.model.Category;
import com.example.demo.model.Location;
import com.example.demo.model.User;
import com.example.demo.repository.AuthorRepository;
import com.example.demo.repository.BookItemRepository;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.BorrowRecordRepository;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.LocationRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.LibrarianService;
import com.example.demo.service.ModuleStateService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LibrarianServiceImpl implements LibrarianService {

    private static final double DAILY_FINE = 5000.0;

    private final BookRepository bookRepository;
    private final BookItemRepository bookItemRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final ModuleStateService moduleStateService;
    private final LibrarianMapper librarianMapper;

    @Override
    public LibrarianDashboardResponse dashboard() {
        long totalBooks = bookRepository.count();
        long totalBorrowing = borrowRecordRepository.findByReturnDateIsNull().size();
        long todayBorrow = borrowRecordRepository.countByBorrowDateBetween(
                LocalDateTime.now().truncatedTo(ChronoUnit.DAYS),
                LocalDateTime.now().truncatedTo(ChronoUnit.DAYS).plusDays(1));

        return new LibrarianDashboardResponse(totalBooks, totalBorrowing, todayBorrow);
    }

    @Override
    public List<LibrarianBookResponse> listBooks() {
        return bookRepository.findAll().stream().map(librarianMapper::toBookResponse).toList();
    }

    @Override
    public LibrarianBookResponse createBook(LibrarianBookRequest request) {
        Book book = new Book();
        applyBookRequest(book, request);
        return librarianMapper.toBookResponse(bookRepository.save(book));
    }

    @Override
    public LibrarianBookResponse updateBook(Long id, LibrarianBookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sách"));
        applyBookRequest(book, request);
        return librarianMapper.toBookResponse(bookRepository.save(book));
    }

    @Override
    public LibrarianDeleteBookResponse deleteBook(Long id) {
        bookRepository.deleteById(id);
        return new LibrarianDeleteBookResponse("Đã xóa sách", id);
    }

    @Override
    public LibrarianCheckoutResponse checkout(LibrarianCheckoutRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng"));
        BookItem item = bookItemRepository.findByBarcode(request.barcode())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy cuốn sách theo barcode"));
        if (item.getStatus() != BookStatus.AVAILABLE) {
            throw new IllegalArgumentException("Sách hiện không sẵn sàng để mượn");
        }

        item.setStatus(BookStatus.BORROWING);
        bookItemRepository.save(item);

        BorrowRecord record = new BorrowRecord();
        record.setUser(user);
        record.setBookItem(item);
        record.setBorrowDate(LocalDateTime.now());
        record.setDueDate(LocalDateTime.now().plusDays(14));
        record.setStatus(BookStatus.BORROWING);
        borrowRecordRepository.save(record);

        return new LibrarianCheckoutResponse("Check-out thành công", record.getId(), record.getDueDate());
    }

    @Override
    public LibrarianCheckinResponse checkin(LibrarianCheckinRequest request) {
        BorrowRecord record = borrowRecordRepository.findFirstByBookItemBarcodeAndReturnDateIsNull(request.barcode())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy giao dịch mượn đang mở"));

        record.setReturnDate(LocalDateTime.now());
        record.setStatus(BookStatus.AVAILABLE);
        if (record.getDueDate() != null && record.getDueDate().isBefore(record.getReturnDate())) {
            long lateDays = ChronoUnit.DAYS.between(record.getDueDate(), record.getReturnDate());
            record.setFineAmount(Math.max(0, lateDays) * DAILY_FINE);
        }
        borrowRecordRepository.save(record);

        BookItem item = record.getBookItem();
        item.setStatus(BookStatus.AVAILABLE);
        bookItemRepository.save(item);

        return new LibrarianCheckinResponse("Check-in thành công", record.getId(), record.getFineAmount());
    }

    @Override
    public List<LibrarianLocationResponse> locations() {
        return locationRepository.findAll().stream()
                .map(librarianMapper::toLocationResponse)
                .toList();
    }

    @Override
    public LibrarianLocationResponse createLocation(LibrarianLocationRequest request) {
        Location location = new Location();
        location.setRoomName(request.roomName());
        location.setShelfNumber(request.shelfNumber());
        Location saved = locationRepository.save(location);
        return librarianMapper.toLocationResponse(saved);
    }

    @Override
    public LibrarianLocationResponse updateLocation(Integer id, LibrarianLocationRequest request) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy vị trí"));
        location.setRoomName(request.roomName());
        location.setShelfNumber(request.shelfNumber());
        return librarianMapper.toLocationResponse(locationRepository.save(location));
    }

    @Override
    public void deleteLocation(Integer id) {
        locationRepository.deleteById(id);
    }

    @Override
    public List<LibrarianAuthorResponse> authors() {
        return authorRepository.findAll().stream()
                .map(author -> new LibrarianAuthorResponse(author.getId(), author.getName()))
                .toList();
    }

    @Override
    public LibrarianAuthorResponse createAuthor(LibrarianAuthorRequest request) {
        Author author = new Author();
        author.setName(request.name());
        Author saved = authorRepository.save(author);
        return new LibrarianAuthorResponse(saved.getId(), saved.getName());
    }

    @Override
    public LibrarianAuthorResponse updateAuthor(Integer id, LibrarianAuthorRequest request) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tác giả"));
        author.setName(request.name());
        Author saved = authorRepository.save(author);
        return new LibrarianAuthorResponse(saved.getId(), saved.getName());
    }

    @Override
    public void deleteAuthor(Integer id) {
        authorRepository.deleteById(id);
    }

    @Override
    public List<LibrarianCategoryResponse> categories() {
        return categoryRepository.findAll().stream()
                .map(category -> new LibrarianCategoryResponse(category.getId(), category.getName()))
                .toList();
    }

    @Override
    public LibrarianCategoryResponse createCategory(LibrarianCategoryRequest request) {
        Category category = new Category();
        category.setName(request.name());
        Category saved = categoryRepository.save(category);
        return new LibrarianCategoryResponse(saved.getId(), saved.getName());
    }

    @Override
    public LibrarianCategoryResponse updateCategory(Integer id, LibrarianCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thể loại"));
        category.setName(request.name());
        Category saved = categoryRepository.save(category);
        return new LibrarianCategoryResponse(saved.getId(), saved.getName());
    }

    @Override
    public void deleteCategory(Integer id) {
        categoryRepository.deleteById(id);
    }

    @Override
    public List<LibrarianRenewalRequestResponse> renewalRequests() {
        return borrowRecordRepository.findByReturnDateIsNull().stream()
            .map(librarianMapper::toRenewalRequestResponse)
                .toList();
    }

    @Override
    public LibrarianApproveRenewResponse approveRenew(Long recordId) {
        BorrowRecord record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bản ghi"));
        record.setDueDate(record.getDueDate().plusDays(7));
        borrowRecordRepository.save(record);
        return new LibrarianApproveRenewResponse("Đã phê duyệt gia hạn", record.getDueDate());
    }

    @Override
    public LibrarianRejectRenewResponse rejectRenew(Long recordId) {
        return new LibrarianRejectRenewResponse("Đã từ chối yêu cầu gia hạn", recordId);
    }

    @Override
    public List<LibrarianDebtorResponse> debtors() {
        return borrowRecordRepository.findAll().stream()
                .filter(record -> record.getFineAmount() != null && record.getFineAmount() > 0)
                .map(record -> new LibrarianDebtorResponse(
                        record.getId(),
                        record.getUser().getUsername(),
                        record.getBookItem().getBook().getTitle(),
                        record.getFineAmount(),
                        record.getDueDate()))
                .toList();
    }

    @Override
    public List<LibrarianIncidentResponse> incidents() {
        return moduleStateService.getIncidents().stream()
                .map(librarianMapper::toIncidentResponse)
                .toList();
    }

    @Override
    public LibrarianIncidentResponse createIncident(LibrarianIncidentRequest request) {
        Map<String, Object> created = moduleStateService.addIncident(Map.of("detail", request.detail()));
        return librarianMapper.toIncidentResponse(created);
    }

    private void applyBookRequest(Book book, LibrarianBookRequest request) {
        book.setTitle(request.title());
        book.setDescription(request.description());
        book.setPublishYear(request.publishYear());
        book.setPublisher(request.publisher());
        book.setCoverImageUrl(request.coverImageUrl());
        book.setDigital(Boolean.TRUE.equals(request.digital()));
    }
}
