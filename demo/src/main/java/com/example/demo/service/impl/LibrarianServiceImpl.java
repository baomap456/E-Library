package com.example.demo.service.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.librarian.LibrarianApproveRenewResponse;
import com.example.demo.dto.librarian.LibrarianAuthorRequest;
import com.example.demo.dto.librarian.LibrarianAuthorResponse;
import com.example.demo.dto.librarian.LibrarianBookRequest;
import com.example.demo.dto.librarian.LibrarianBookResponse;
import com.example.demo.dto.librarian.LibrarianBorrowerOptionResponse;
import com.example.demo.dto.librarian.LibrarianCategoryRequest;
import com.example.demo.dto.librarian.LibrarianCategoryResponse;
import com.example.demo.dto.librarian.LibrarianCheckinRequest;
import com.example.demo.dto.librarian.LibrarianCheckinResponse;
import com.example.demo.dto.librarian.LibrarianCheckoutRequest;
import com.example.demo.dto.librarian.LibrarianCheckoutResponse;
import com.example.demo.dto.librarian.LibrarianCreateUserRequest;
import com.example.demo.dto.librarian.LibrarianCreateUserResponse;
import com.example.demo.dto.librarian.LibrarianDashboardResponse;
import com.example.demo.dto.librarian.LibrarianDebtorResponse;
import com.example.demo.dto.librarian.LibrarianDeleteBookResponse;
import com.example.demo.dto.librarian.LibrarianDigitalDocumentRequest;
import com.example.demo.dto.librarian.LibrarianDigitalDocumentResponse;
import com.example.demo.dto.librarian.LibrarianGuestCheckoutRequest;
import com.example.demo.dto.librarian.LibrarianIncidentRequest;
import com.example.demo.dto.librarian.LibrarianIncidentResponse;
import com.example.demo.dto.librarian.LibrarianLocationRequest;
import com.example.demo.dto.librarian.LibrarianLocationResponse;
import com.example.demo.dto.librarian.LibrarianRejectRenewResponse;
import com.example.demo.dto.librarian.LibrarianRenewalRequestResponse;
import com.example.demo.dto.librarian.LibrarianReportIncidentRequest;
import com.example.demo.dto.librarian.LibrarianReportIncidentResponse;
import com.example.demo.dto.librarian.LibrarianUpgradeAccountRequest;
import com.example.demo.dto.librarian.LibrarianUpgradeAccountResponse;
import com.example.demo.dto.profile.UpgradeMembershipRequest;
import com.example.demo.dto.profile.UpgradeMembershipResponse;
import com.example.demo.mapper.LibrarianMapper;
import com.example.demo.model.Author;
import com.example.demo.model.Book;
import com.example.demo.model.BookItem;
import com.example.demo.model.BookStatus;
import com.example.demo.model.BorrowRecord;
import com.example.demo.model.Category;
import com.example.demo.model.Location;
import com.example.demo.model.MembershipType;
import com.example.demo.model.Reservation;
import com.example.demo.model.ReservationStatus;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.AuthorRepository;
import com.example.demo.repository.BookItemRepository;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.BorrowRecordRepository;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.LocationRepository;
import com.example.demo.repository.MembershipTypeRepository;
import com.example.demo.repository.ReservationRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuditLogService;
import com.example.demo.service.DebtRestrictionService;
import com.example.demo.service.LibrarianService;
import com.example.demo.service.ModuleStateService;
import com.example.demo.service.NotificationDispatchService;
import com.example.demo.service.ProfileService;
import com.example.demo.service.RenewalPolicyService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LibrarianServiceImpl implements LibrarianService {

    private static final double DAILY_FINE = 5000.0;
    private static final String MEMBER_ROLE = "ROLE_MEMBER";
    private static final String GUEST_ROLE = "ROLE_GUEST";
    private static final String BORROW_MODE_TAKE_HOME = "TAKE_HOME";
    private static final String BORROW_MODE_READ_ON_SITE = "READ_ON_SITE";
    private static final String INCIDENT_LOST = "LOST";
    private static final String INCIDENT_DAMAGED = "DAMAGED";
    private static final String DAMAGE_LIGHT = "LIGHT";
    private static final String DAMAGE_HEAVY = "HEAVY";
    private static final String ACTOR_LIBRARIAN = "LIBRARIAN";
    private static final String TARGET_BORROW_RECORD = "BORROW_RECORD";

    private final BookRepository bookRepository;
    private final BookItemRepository bookItemRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final RoleRepository roleRepository;
    private final MembershipTypeRepository membershipTypeRepository;
    private final NotificationDispatchService notificationDispatchService;
    private final ReservationRepository reservationRepository;
    private final ModuleStateService moduleStateService;
    private final ProfileService profileService;
    private final PasswordEncoder passwordEncoder;
    private final DebtRestrictionService debtRestrictionService;
    private final RenewalPolicyService renewalPolicyService;
    private final LibrarianMapper librarianMapper;
    private final AuditLogService auditLogService;

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
        return bookRepository.findAll().stream().map(this::toBookResponse).toList();
    }

    @Override
    public List<LibrarianDigitalDocumentResponse> listDigitalDocuments() {
        return bookRepository.findByIsDigitalTrue().stream()
                .map(this::toDigitalDocumentResponse)
                .toList();
    }

    @Override
    public LibrarianDigitalDocumentResponse createDigitalDocument(LibrarianDigitalDocumentRequest request) {
        Book book = new Book();
        applyDigitalDocumentRequest(book, request);
        Book saved = bookRepository.save(book);
        auditLogService.log(ACTOR_LIBRARIAN, "CREATE_DIGITAL_DOCUMENT", "BOOK", String.valueOf(saved.getId()), saved.getTitle());
        return toDigitalDocumentResponse(saved);
    }

    @Override
    public LibrarianDigitalDocumentResponse updateDigitalDocument(Long id, LibrarianDigitalDocumentRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài liệu số"));
        applyDigitalDocumentRequest(book, request);
        Book saved = bookRepository.save(book);
        auditLogService.log(ACTOR_LIBRARIAN, "UPDATE_DIGITAL_DOCUMENT", "BOOK", String.valueOf(saved.getId()), saved.getTitle());
        return toDigitalDocumentResponse(saved);
    }

    @Override
    public void deleteDigitalDocument(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài liệu số"));
        if (!book.isDigital()) {
            throw new IllegalArgumentException("Bản ghi này không phải tài liệu số");
        }
        bookRepository.delete(book);
        auditLogService.log(ACTOR_LIBRARIAN, "DELETE_DIGITAL_DOCUMENT", "BOOK", String.valueOf(id), book.getTitle());
    }

    @Override
    public LibrarianBookResponse createBook(LibrarianBookRequest request) {
        Book book = new Book();
        applyBookRequest(book, request);
        Book saved = bookRepository.save(book);
        return toBookResponse(saved);
    }

    @Override
    public LibrarianBookResponse updateBook(Long id, LibrarianBookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sách"));
        applyBookRequest(book, request);
        Book saved = bookRepository.save(book);
        return toBookResponse(saved);
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
        if (hasRole(user, "ROLE_LIBRARIAN") || hasRole(user, "ROLE_ADMIN")) {
            throw new IllegalArgumentException("Không thể lập phiếu mượn cho tài khoản thủ thư");
        }
        debtRestrictionService.assertBorrowingAllowed(user, "mượn sách");
        LibrarianCheckoutResponse response = createCheckoutForBorrower(
            user,
            request.barcode(),
            "Lập phiếu mượn thành công",
            BORROW_MODE_TAKE_HOME,
            0.0,
            null,
            false);
        auditLogService.log(ACTOR_LIBRARIAN, "CHECKOUT", TARGET_BORROW_RECORD, String.valueOf(response.recordId()), request.barcode());
        return response;
    }

    @Override
    public LibrarianCheckoutResponse guestCheckout(LibrarianGuestCheckoutRequest request) {
        User guest = createGuestBorrower(request.guestName(), request.phone());
        String borrowMode = normalizeBorrowMode(request.borrowMode());
        double depositAmount = resolveGuestDeposit(borrowMode, request.depositAmount());
        String citizenId = resolveGuestCitizenId(borrowMode, request.citizenId());
        boolean temporaryRecord = BORROW_MODE_READ_ON_SITE.equals(borrowMode);
        LibrarianCheckoutResponse response = createCheckoutForBorrower(
                guest,
                request.barcode(),
                "Lập phiếu mượn cho khách thành công",
                borrowMode,
                depositAmount,
                citizenId,
                temporaryRecord);
        auditLogService.log(ACTOR_LIBRARIAN, "GUEST_CHECKOUT", TARGET_BORROW_RECORD, String.valueOf(response.recordId()), request.barcode());
        return response;
    }

    @Override
    public List<LibrarianBorrowerOptionResponse> borrowers(String keyword) {
        List<User> users;
        if (keyword == null || keyword.isBlank()) {
            users = userRepository.findTop30ByOrderByUsernameAsc();
        } else {
            String q = keyword.trim();
            users = userRepository.findTop30ByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCaseOrderByUsernameAsc(q, q);
        }

        return users.stream()
                .filter(this::isMemberBorrower)
                .map(user -> new LibrarianBorrowerOptionResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getFullName(),
                        user.getEmail()))
                .toList();
        }

    @Override
    public LibrarianCreateUserResponse createUser(LibrarianCreateUserRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username đã tồn tại");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email đã được sử dụng");
        }

        Role memberRole = roleRepository.findByName(MEMBER_ROLE)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName(MEMBER_ROLE);
                    return roleRepository.save(role);
                });

        MembershipType freeMembership = membershipTypeRepository.findByName("Free")
                .orElseGet(() -> {
                    MembershipType membershipType = new MembershipType();
                    membershipType.setName("Free");
                    membershipType.setPaid(false);
                    membershipType.setMaxBooks(3);
                    membershipType.setBorrowDurationDays(14);
                    membershipType.setFineRatePerDay(5000.0);
                    membershipType.setPrivilegeNote("Goi mien phi phu hop nhu cau co ban");
                    return membershipTypeRepository.save(membershipType);
                });

        User user = new User();
        user.setUsername(request.username().trim());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setEmail(request.email().trim());
        user.setFullName(request.fullName().trim());
        user.setStudentId(request.studentId() == null || request.studentId().isBlank() ? null : request.studentId().trim());
        user.setActive(true);
        user.setRoles(Set.of(memberRole));
        user.setMembershipType(freeMembership);

        User saved = userRepository.save(user);

        return new LibrarianCreateUserResponse(
                "Tạo tài khoản người dùng thành công",
                saved.getId(),
                saved.getUsername(),
                saved.getEmail(),
                saved.getMembershipType() != null ? saved.getMembershipType().getName() : "Free");
    }

    @Override
    public LibrarianUpgradeAccountResponse upgradeAccount(LibrarianUpgradeAccountRequest request) {
        UpgradeMembershipResponse upgraded = profileService.upgradeMembership(
                request.username(),
                new UpgradeMembershipRequest(request.targetPackage()));

        return new LibrarianUpgradeAccountResponse(
                upgraded.message(),
                request.username(),
                upgraded.fromPackage(),
                upgraded.toPackage(),
                upgraded.paid());
    }

    @Override
    public LibrarianCheckinResponse checkin(LibrarianCheckinRequest request) {
        BorrowRecord borrowRecord = borrowRecordRepository.findFirstByBookItemBarcodeAndReturnDateIsNull(request.barcode())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy giao dịch mượn đang mở"));

        borrowRecord.setReturnDate(LocalDateTime.now());
        borrowRecord.setStatus(BookStatus.AVAILABLE);
        if (borrowRecord.getDueDate() != null && borrowRecord.getDueDate().isBefore(borrowRecord.getReturnDate())) {
            long lateDays = ChronoUnit.DAYS.between(borrowRecord.getDueDate(), borrowRecord.getReturnDate());
            borrowRecord.setFineAmount(Math.max(0, lateDays) * DAILY_FINE);
        }
        borrowRecordRepository.save(borrowRecord);

        BookItem item = borrowRecord.getBookItem();
        LocalDateTime now = LocalDateTime.now();
        assignNextReservation(item, now);
        bookItemRepository.save(item);

        auditLogService.log(ACTOR_LIBRARIAN, "CHECKIN", TARGET_BORROW_RECORD, String.valueOf(borrowRecord.getId()), request.barcode());
        return new LibrarianCheckinResponse("Check-in thành công", borrowRecord.getId(), borrowRecord.getFineAmount());
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
        BorrowRecord borrowRecord = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bản ghi"));

        RenewalPolicyService.RenewalDecision decision = renewalPolicyService.evaluate(borrowRecord);
        if (!decision.allowed()) {
            throw new IllegalArgumentException(decision.reason());
        }

        renewalPolicyService.applyRenewal(borrowRecord);
        borrowRecordRepository.save(borrowRecord);
        return new LibrarianApproveRenewResponse("Đã phê duyệt gia hạn", borrowRecord.getDueDate());
    }

    @Override
    public LibrarianRejectRenewResponse rejectRenew(Long recordId) {
        return new LibrarianRejectRenewResponse("Đã từ chối yêu cầu gia hạn", recordId);
    }

    @Override
    public List<LibrarianDebtorResponse> debtors() {
        LocalDateTime now = LocalDateTime.now();
        return borrowRecordRepository.findAll().stream()
            .filter(borrowRecord -> borrowRecord.getFineAmount() != null && borrowRecord.getFineAmount() > 0)
            .map(borrowRecord -> {
                User user = borrowRecord.getUser();
                double outstandingDebt = debtRestrictionService.refreshDebtStatus(user);
            boolean overdue = borrowRecord.getReturnDate() == null
                && borrowRecord.getDueDate() != null
                && borrowRecord.getDueDate().isBefore(now);
            long overdueDays = overdue
                ? Math.max(1, ChronoUnit.DAYS.between(borrowRecord.getDueDate().toLocalDate(), now.toLocalDate()))
                : 0;
                return new LibrarianDebtorResponse(
                        borrowRecord.getId(),
                        user.getUsername(),
                        borrowRecord.getBookItem().getBook().getTitle(),
                        borrowRecord.getFineAmount(),
                        borrowRecord.getDueDate(),
                        outstandingDebt,
                user.isBorrowingLocked(),
                overdueDays,
                overdue);
            })
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

    @Override
    @Transactional
    public LibrarianReportIncidentResponse reportBorrowIncident(LibrarianReportIncidentRequest request) {
        BorrowRecord borrowRecord = borrowRecordRepository.findById(request.recordId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu mượn"));

        String incidentType = normalizeIncidentType(request.incidentType());
        BookStatus targetStatus;
        double compensationAmount;
        String damageSeverity = null;

        if (INCIDENT_LOST.equals(incidentType)) {
            double rate = normalizeLostRate(request.lostCompensationRate());
            compensationAmount = estimateReplacementCost(borrowRecord.getBookItem().getBook()) * (rate / 100.0);
            targetStatus = BookStatus.LOST;
        } else {
            damageSeverity = normalizeDamageSeverity(request.damageSeverity());
            if (request.repairCost() == null || request.repairCost() <= 0) {
                throw new IllegalArgumentException("Sự cố hư hại cần nhập chi phí sửa chữa > 0");
            }
            compensationAmount = request.repairCost();
            targetStatus = BookStatus.DAMAGED;
        }

        User borrower = borrowRecord.getUser();
        boolean isGuest = hasRole(borrower, GUEST_ROLE);
        double deductedFromDeposit = isGuest
                ? Math.min(Objects.requireNonNullElse(borrowRecord.getDepositAmount(), 0.0), compensationAmount)
                : 0.0;
        double remainingDebt = Math.max(0, compensationAmount - deductedFromDeposit);

        borrowRecord.setIncidentType(incidentType);
        borrowRecord.setDamageSeverity(damageSeverity);
        borrowRecord.setIncidentNote(request.note());
        borrowRecord.setCompensationAmount(compensationAmount);
        borrowRecord.setFineAmount(remainingDebt);
        borrowRecord.setStatus(targetStatus);
        borrowRecord.setReturnDate(LocalDateTime.now());
        borrowRecord.setDepositAmount(Math.max(0, Objects.requireNonNullElse(borrowRecord.getDepositAmount(), 0.0) - deductedFromDeposit));
        borrowRecordRepository.save(borrowRecord);

        BookItem bookItem = borrowRecord.getBookItem();
        bookItem.setStatus(targetStatus);
        bookItemRepository.save(bookItem);

        cancelReservationsForUnavailableBook(bookItem.getBook(), targetStatus.name());

        double outstandingDebt = debtRestrictionService.refreshDebtStatus(borrower);
        createDebtNotification(borrower, borrowRecord, incidentType, compensationAmount, deductedFromDeposit, remainingDebt, outstandingDebt);

        auditLogService.log(
                ACTOR_LIBRARIAN,
                "REPORT_INCIDENT",
                TARGET_BORROW_RECORD,
                String.valueOf(borrowRecord.getId()),
                incidentType + " -> " + targetStatus.name());

        return new LibrarianReportIncidentResponse(
                "Ghi nhận sự cố thành công",
                borrowRecord.getId(),
                incidentType,
                targetStatus.name(),
                compensationAmount,
                deductedFromDeposit,
                remainingDebt,
                borrower.isBorrowingLocked());
    }

    private void applyBookRequest(Book book, LibrarianBookRequest request) {
        book.setTitle(request.title());
        book.setDescription(request.description());
        book.setPublishYear(request.publishYear());
        book.setPublisher(request.publisher());
        book.setCoverImageUrl(request.coverImageUrl());
        book.setDigital(Boolean.TRUE.equals(request.digital()));
        if (!Boolean.TRUE.equals(request.digital())) {
            book.setCanTakeHome(true);
        }
    }

    private void applyDigitalDocumentRequest(Book book, LibrarianDigitalDocumentRequest request) {
        book.setTitle(request.title());
        book.setDescription(request.description());
        book.setPublishYear(request.publishYear());
        book.setPublisher(request.publisher());
        book.setCoverImageUrl(request.fileUrl());
        book.setIsbn(request.isbn());
        book.setDigital(true);
        book.setCanTakeHome(false);
    }

    private LibrarianDigitalDocumentResponse toDigitalDocumentResponse(Book book) {
        return new LibrarianDigitalDocumentResponse(
                book.getId(),
                book.getTitle(),
                book.getDescription(),
                book.getPublishYear(),
                book.getPublisher(),
                book.getCoverImageUrl(),
                book.getIsbn());
    }

    private LibrarianBookResponse toBookResponse(Book book) {
        long availableCopies = bookItemRepository.countByBookIdAndStatus(book.getId(), BookStatus.AVAILABLE);
        String availableBarcode = bookItemRepository.findFirstByBookIdAndStatus(book.getId(), BookStatus.AVAILABLE)
                .map(BookItem::getBarcode)
                .orElse(null);
        return librarianMapper.toBookResponse(book, availableCopies, availableBarcode);
    }

    private LibrarianCheckoutResponse createCheckoutForBorrower(
            User borrower,
            String barcode,
            String message,
            String borrowMode,
            Double depositAmount,
            String citizenId,
            boolean temporaryRecord) {
        if (hasRole(borrower, "ROLE_LIBRARIAN") || hasRole(borrower, "ROLE_ADMIN")) {
            throw new IllegalArgumentException("Không thể lập phiếu mượn cho tài khoản thủ thư");
        }
        BookItem item = bookItemRepository.findByBarcode(barcode)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy cuốn sách theo barcode"));
        if (item.getStatus() == BookStatus.RESERVED) {
            consumeReservationForBorrower(borrower, item);
        } else if (item.getStatus() != BookStatus.AVAILABLE) {
            throw new IllegalArgumentException("Sách hiện không sẵn sàng để mượn");
        }
        if (BORROW_MODE_TAKE_HOME.equals(borrowMode) && Boolean.FALSE.equals(item.getBook().getCanTakeHome())) {
            throw new IllegalArgumentException("Sách này không được phép mang về nhà");
        }

        item.setStatus(BookStatus.BORROWING);
        bookItemRepository.save(item);

        BorrowRecord borrowRecord = new BorrowRecord();
        borrowRecord.setUser(borrower);
        borrowRecord.setBookItem(item);
        borrowRecord.setBorrowDate(LocalDateTime.now());
        if (BORROW_MODE_READ_ON_SITE.equals(borrowMode)) {
            borrowRecord.setDueDate(LocalDateTime.now().plusHours(8));
        } else {
            borrowRecord.setDueDate(LocalDateTime.now().plusDays(14));
        }
        borrowRecord.setBorrowMode(borrowMode);
        borrowRecord.setDepositAmount(depositAmount == null ? 0.0 : depositAmount);
        borrowRecord.setBorrowerCitizenId(citizenId);
        borrowRecord.setTemporaryRecord(temporaryRecord);
        borrowRecord.setStatus(BookStatus.BORROWING);
        borrowRecordRepository.save(borrowRecord);

        return new LibrarianCheckoutResponse(
                message,
                borrowRecord.getId(),
                borrowRecord.getDueDate(),
                borrower.getUsername(),
                borrowMode,
                borrowRecord.getDepositAmount(),
                borrowRecord.getBorrowerCitizenId(),
                borrowRecord.getTemporaryRecord());
    }

    private String normalizeBorrowMode(String input) {
        if (input == null || input.isBlank()) {
            return BORROW_MODE_TAKE_HOME;
        }
        String mode = input.trim().toUpperCase();
        if (!BORROW_MODE_TAKE_HOME.equals(mode) && !BORROW_MODE_READ_ON_SITE.equals(mode)) {
            throw new IllegalArgumentException("borrowMode chỉ hỗ trợ TAKE_HOME hoặc READ_ON_SITE");
        }
        return mode;
    }

    private double resolveGuestDeposit(String borrowMode, Double depositAmount) {
        if (BORROW_MODE_READ_ON_SITE.equals(borrowMode)) {
            return 0.0;
        }
        if (depositAmount == null || depositAmount <= 0) {
            throw new IllegalArgumentException("Khách mượn mang về phải cọc tiền ứng trước > 0");
        }
        return depositAmount;
    }

    private User createGuestBorrower(String guestName, String phone) {
        Role guestRole = roleRepository.findByName(GUEST_ROLE)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName(GUEST_ROLE);
                    return roleRepository.save(role);
                });

        MembershipType freeMembership = membershipTypeRepository.findByName("Free")
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy gói Free"));

        String username = buildUniqueGuestUsername();

        User guest = new User();
        guest.setUsername(username);
        guest.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        guest.setEmail(username + "@guest.elib.local");
        guest.setFullName(guestName.trim());
        guest.setPhone(phone == null || phone.isBlank() ? null : phone.trim());
        guest.setStudentId("GUEST");
        guest.setActive(true);
        guest.setRoles(Set.of(guestRole));
        guest.setMembershipType(freeMembership);

        return userRepository.save(guest);
    }

    private String buildUniqueGuestUsername() {
        for (int i = 0; i < 5; i++) {
            String candidate = "guest" + System.currentTimeMillis() + ThreadLocalRandom.current().nextInt(1000);
            if (!userRepository.existsByUsername(candidate)) {
                return candidate;
            }
        }
        return "guest" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }

    private boolean isMemberBorrower(User user) {
        return user.getRoles().stream().anyMatch(role -> MEMBER_ROLE.equals(role.getName()));
    }

    private String normalizeIncidentType(String incidentType) {
        if (incidentType == null || incidentType.isBlank()) {
            throw new IllegalArgumentException("incidentType không được để trống");
        }
        String normalized = incidentType.trim().toUpperCase();
        if (!INCIDENT_LOST.equals(normalized) && !INCIDENT_DAMAGED.equals(normalized)) {
            throw new IllegalArgumentException("incidentType chỉ hỗ trợ LOST hoặc DAMAGED");
        }
        return normalized;
    }

    private String normalizeDamageSeverity(String severity) {
        if (severity == null || severity.isBlank()) {
            throw new IllegalArgumentException("Hư hại cần chọn mức độ LIGHT hoặc HEAVY");
        }
        String normalized = severity.trim().toUpperCase();
        if (!DAMAGE_LIGHT.equals(normalized) && !DAMAGE_HEAVY.equals(normalized)) {
            throw new IllegalArgumentException("damageSeverity chỉ hỗ trợ LIGHT hoặc HEAVY");
        }
        return normalized;
    }

    private double normalizeLostRate(Double rate) {
        double value = rate == null ? 100.0 : rate;
        if (value != 100.0 && value != 150.0) {
            throw new IllegalArgumentException("Bồi thường mất sách chỉ hỗ trợ 100% hoặc 150%");
        }
        return value;
    }

    private double estimateReplacementCost(Book book) {
        if (book == null) {
            return 100000.0;
        }
        int currentYear = LocalDateTime.now().getYear();
        int age = Math.max(0, currentYear - book.getPublishYear());
        double base = 200000.0;
        return Math.max(50000.0, base - (age * 5000.0));
    }

    private boolean hasRole(User user, String roleName) {
        return user.getRoles().stream().anyMatch(role -> roleName.equals(role.getName()));
    }

    private void createDebtNotification(
            User user,
            BorrowRecord borrowRecord,
            String incidentType,
            double compensationAmount,
            double deductedFromDeposit,
            double remainingDebt,
            double outstandingDebt) {
        String message = "Sự cố " + incidentType + " cho phiếu #" + borrowRecord.getId()
                + ". Bồi thường: " + Math.round(compensationAmount)
                + " VND. Đã trừ cọc: " + Math.round(deductedFromDeposit)
                + " VND. Còn nợ: " + Math.round(remainingDebt)
                + " VND. Tổng nợ hiện tại: " + Math.round(outstandingDebt)
                + " VND. Tài khoản sẽ bị khóa chức năng mượn/hàng chờ/digital cho tới khi thanh toán xong.";

        notificationDispatchService.createAndDispatch(user, message);
    }

    private String resolveGuestCitizenId(String borrowMode, String citizenId) {
        if (BORROW_MODE_READ_ON_SITE.equals(borrowMode)) {
            return null;
        }
        if (citizenId == null || citizenId.isBlank()) {
            throw new IllegalArgumentException("Khách mang sách về phải cung cấp căn cước công dân");
        }
        String normalized = citizenId.trim();
        if (!normalized.matches("\\d{9,12}")) {
            throw new IllegalArgumentException("Căn cước công dân không hợp lệ");
        }
        return normalized;
    }

    @Scheduled(cron = "0 0 1 * * *")
    @Transactional
    public void autoMarkOverdueTakeHomeAsLost() {
        LocalDateTime threshold = LocalDateTime.now().minusDays(10);
        List<BorrowRecord> overdueRecords = borrowRecordRepository
                .findByReturnDateIsNullAndBorrowModeAndDueDateBefore(BORROW_MODE_TAKE_HOME, threshold);

        for (BorrowRecord borrowRecord : overdueRecords) {
            if (borrowRecord.getStatus() == BookStatus.LOST) {
                continue;
            }
            borrowRecord.setStatus(BookStatus.LOST);
            BookItem item = borrowRecord.getBookItem();
            item.setStatus(BookStatus.LOST);
            bookItemRepository.save(item);
            borrowRecordRepository.save(borrowRecord);
        }
    }

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void processExpiredWaitlistReservations() {
        LocalDateTime now = LocalDateTime.now();
        List<Reservation> expiredReservations = reservationRepository.findByStatusAndExpiryDateBefore(
                ReservationStatus.NOTIFIED,
                now);
        for (Reservation expired : expiredReservations) {
            BookItem item = expired.getBookItem();
            if (item == null || item.getStatus() == BookStatus.BORROWING) {
                continue;
            }

            expired.setStatus(ReservationStatus.EXPIRED);
            expired.setExpiredAt(now);
            reservationRepository.save(expired);
            notifyReservationExpired(expired);

            assignNextReservation(item, now);
            bookItemRepository.save(item);
        }
    }

    private void assignNextReservation(BookItem item, LocalDateTime now) {
        Optional<Reservation> next = reservationRepository.findFirstByBookIdAndStatusOrderByCreatedAtAsc(
                item.getBook().getId(),
                ReservationStatus.PENDING);
        if (next.isPresent()) {
            Reservation reservation = next.get();
            reservation.setStatus(ReservationStatus.NOTIFIED);
            reservation.setBookItem(item);
            reservation.setNotifiedAt(now);
            reservation.setExpiryDate(now.plusHours(24));
            reservationRepository.save(reservation);
            item.setStatus(BookStatus.RESERVED);
            notifyReservationReady(reservation);
            return;
        }

        item.setStatus(BookStatus.AVAILABLE);
    }

    private void consumeReservationForBorrower(User borrower, BookItem item) {
        Reservation reservation = reservationRepository.findByBookItemIdAndStatus(item.getId(), ReservationStatus.NOTIFIED)
                .orElseThrow(() -> new IllegalArgumentException("Sách đang được giữ chỗ cho độc giả trong hàng chờ"));
        if (reservation.getExpiryDate() != null && !reservation.getExpiryDate().isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("Phiếu giữ chỗ đã hết hạn, vui lòng chờ hệ thống chuyển lượt");
        }
        if (!Objects.equals(reservation.getUser().getId(), borrower.getId())) {
            throw new IllegalArgumentException("Sách đang được giữ chỗ cho độc giả khác trong hàng chờ");
        }
        reservation.setStatus(ReservationStatus.COMPLETED);
        reservation.setCompletedAt(LocalDateTime.now());
        reservationRepository.save(reservation);
    }

    private void notifyReservationReady(Reservation reservation) {
        notificationDispatchService.createAndDispatch(
            reservation.getUser(),
            "Sách '" + reservation.getBook().getTitle()
                + "' đã về! Bạn có 24h (đến " + reservation.getExpiryDate() + ") để đến nhận.",
            "mail/reservation-ready",
            Map.of(
                "bookTitle", reservation.getBook().getTitle(),
                "expiryDate", reservation.getExpiryDate()));
    }

    private void notifyReservationExpired(Reservation reservation) {
        notificationDispatchService.createAndDispatch(
            reservation.getUser(),
            "Quyền nhận sách '" + reservation.getBook().getTitle()
                + "' đã hết hạn lúc " + reservation.getExpiryDate() + ". Hệ thống đã chuyển cho người kế tiếp.");
    }

    private void cancelReservationsForUnavailableBook(Book book, String reasonStatus) {
        List<Reservation> activeReservations = reservationRepository.findByBookIdAndStatusIn(
                book.getId(),
                List.of(ReservationStatus.PENDING, ReservationStatus.NOTIFIED));
        LocalDateTime now = LocalDateTime.now();
        for (Reservation reservation : activeReservations) {
            reservation.setStatus(ReservationStatus.CANCELLED);
            reservation.setCancelledAt(now);
            reservationRepository.save(reservation);

                notificationDispatchService.createAndDispatch(
                    reservation.getUser(),
                    "Rất tiếc, cuốn sách bạn đang đợi '" + book.getTitle()
                        + "' đã " + ("LOST".equals(reasonStatus) ? "bị thất lạc" : "bị hư hỏng")
                        + " và không còn khả dụng. Hệ thống đã hủy đặt trước của bạn.");
        }
    }
}
