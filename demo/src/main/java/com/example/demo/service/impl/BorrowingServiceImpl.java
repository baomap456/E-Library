package com.example.demo.service.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.borrowing.AddCartItemRequest;
import com.example.demo.dto.borrowing.BorrowRecordResponse;
import com.example.demo.dto.borrowing.CartItemActionResponse;
import com.example.demo.dto.borrowing.CartItemResponse;
import com.example.demo.dto.borrowing.FinePaymentResponse;
import com.example.demo.dto.borrowing.FinesResponse;
import com.example.demo.dto.borrowing.PaidFineHistoryResponse;
import com.example.demo.dto.borrowing.PayFineRequest;
import com.example.demo.dto.borrowing.RecalculateFineRequest;
import com.example.demo.dto.borrowing.RecalculateFineResponse;
import com.example.demo.dto.borrowing.RenewRecordResponse;
import com.example.demo.dto.borrowing.WaitlistItemResponse;
import com.example.demo.dto.borrowing.WaitlistRequest;
import com.example.demo.dto.borrowing.WaitlistResponse;
import com.example.demo.mapper.BorrowingMapper;
import com.example.demo.model.Book;
import com.example.demo.model.BookItem;
import com.example.demo.model.BookStatus;
import com.example.demo.model.BorrowRecord;
import com.example.demo.model.BorrowRequestStatus;
import com.example.demo.model.FinePayment;
import com.example.demo.model.Reservation;
import com.example.demo.model.ReservationStatus;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.BookItemRepository;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.BorrowRecordRepository;
import com.example.demo.repository.BorrowRequestRepository;
import com.example.demo.repository.FinePaymentRepository;
import com.example.demo.repository.ReservationRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuditLogService;
import com.example.demo.service.BorrowingService;
import com.example.demo.service.DebtRestrictionService;
import com.example.demo.service.ModuleStateService;
import com.example.demo.service.NotificationDispatchService;
import com.example.demo.service.RenewalPolicyService;
import com.example.demo.service.UserContextService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BorrowingServiceImpl implements BorrowingService {

    private static final String DEFAULT_PAYMENT_METHOD = "ONLINE";
    private static final double DAILY_FINE = 5000.0;
    private static final String BORROW_RECORD_NOT_FOUND = "Không tìm thấy bản ghi mượn";
    private static final int MAX_ACTIVE_RESERVATIONS = 3;
    private static final Set<BookStatus> OVERDUE_SCAN_STATUSES = Set.of(BookStatus.BORROWING, BookStatus.OVERDUE);

    private final UserContextService userContextService;
    private final ModuleStateService moduleStateService;
    private final ReservationRepository reservationRepository;
    private final NotificationDispatchService notificationDispatchService;
    private final BookItemRepository bookItemRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final BorrowRequestRepository borrowRequestRepository;
    private final FinePaymentRepository finePaymentRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BorrowingMapper borrowingMapper;
    private final DebtRestrictionService debtRestrictionService;
    private final RenewalPolicyService renewalPolicyService;
    private final AuditLogService auditLogService;

    @Value("${app.overdue.daily-fine:5000}")
    private double overdueDailyFine;

    @Value("${app.overdue.lock-days-threshold:7}")
    private int overdueLockDaysThreshold;

    @Value("${app.overdue.lock-fine-threshold:50000}")
    private double overdueLockFineThreshold;

    @Override
    public List<CartItemResponse> getCart(String username) {
        User user = userContextService.resolveUser(username);
        return moduleStateService.getCart(user.getId()).stream()
                .map(bookId -> bookRepository.findById(bookId)
                .map(book -> borrowingMapper.toCartItemResponse(bookId, book))
                .orElse(borrowingMapper.toCartItemResponse(bookId, null)))
                .toList();
    }

    @Override
    public CartItemActionResponse addCartItem(AddCartItemRequest request) {
        if (request.bookId() == null) {
            throw new IllegalArgumentException("bookId không được để trống");
        }
        User user = userContextService.resolveUser(request.username());
        debtRestrictionService.assertBorrowingAllowed(user, "mượn sách");
        
        // Prevent librarians from borrowing
        if (isLibrarian(user)) {
            throw new IllegalArgumentException("Thủ thư không thể mượn sách. Vui lòng sử dụng chức năng duyệt yêu cầu mượn");
        }
        
        moduleStateService.addToCart(user.getId(), request.bookId());
        return new CartItemActionResponse("Đã thêm sách vào giỏ đặt mượn", request.bookId());
    }

    @Override
    public CartItemActionResponse removeCartItem(Long bookId, String username) {
        User user = userContextService.resolveUser(username);
        moduleStateService.removeFromCart(user.getId(), bookId);
        return new CartItemActionResponse("Đã xóa khỏi giỏ", bookId);
    }

    @Override
    public List<BorrowRecordResponse> getRecords(String username) {
        User user = userContextService.resolveUser(username);
        return borrowRecordRepository.findByUserIdOrderByBorrowDateDesc(user.getId()).stream()
                .map(borrowRecord -> {
                    RenewalPolicyService.RenewalDecision decision = renewalPolicyService.evaluate(borrowRecord);
                    return borrowingMapper.toBorrowRecordResponse(
                            borrowRecord,
                            renewalPolicyService.maxRenewals(),
                            decision.allowed(),
                            decision.reason(),
                            decision.daysUntilDue());
                })
                .toList();
    }

    @Override
    public List<WaitlistItemResponse> getMyWaitlist(String username) {
        User user = userContextService.resolveUser(username);
        List<ReservationStatus> activeStatuses = List.of(ReservationStatus.PENDING, ReservationStatus.NOTIFIED);
        return reservationRepository.findByUserIdAndStatusInOrderByCreatedAtDesc(user.getId(), activeStatuses).stream()
            .map(reservation -> {
                int position = reservation.getStatus() == ReservationStatus.NOTIFIED
                    ? 1
                    : waitlistPosition(reservation);
                return new WaitlistItemResponse(
                    reservation.getId(),
                    reservation.getBook().getId(),
                    reservation.getBook().getTitle(),
                    position,
                    reservation.getStatus().name(),
                    reservation.getExpiryDate());
            }).toList();
    }

    @Override
    public RenewRecordResponse renew(Long recordId) {
        User currentUser = userContextService.getCurrentUser();
        BorrowRecord borrowRecord = borrowRecordRepository.findById(recordId)
            .orElseThrow(() -> new IllegalArgumentException(BORROW_RECORD_NOT_FOUND));
        if (!Objects.equals(borrowRecord.getUser().getId(), currentUser.getId()) && !isLibrarian(currentUser)) {
            throw new IllegalArgumentException("Bạn không có quyền gia hạn phiếu mượn này");
        }

        RenewalPolicyService.RenewalDecision decision = renewalPolicyService.evaluate(borrowRecord);
        if (!decision.allowed()) {
            throw new IllegalArgumentException(decision.reason());
        }

        renewalPolicyService.applyRenewal(borrowRecord);
        borrowRecordRepository.save(borrowRecord);
        return new RenewRecordResponse("Gia hạn thành công", borrowRecord.getDueDate());
    }

    @Override
    public WaitlistResponse joinWaitlist(WaitlistRequest request) {
        if (request.bookId() == null) {
            throw new IllegalArgumentException("bookId không được để trống");
        }
        User user = userContextService.resolveUser(request.username());
        debtRestrictionService.assertBorrowingAllowed(user, "tham gia hàng chờ");

        if (isLibrarian(user)) {
            throw new IllegalArgumentException("Thủ thư không thể tham gia hàng chờ");
        }

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sách"));

        long availableCopies = bookItemRepository.countByBookIdAndStatus(book.getId(), com.example.demo.model.BookStatus.AVAILABLE);
        if (availableCopies > 0) {
            throw new IllegalArgumentException("Sách vẫn còn bản khả dụng, bạn có thể lập phiếu mượn trực tiếp");
        }

        boolean hasBorrowSlipForBook = borrowRequestRepository.existsByStatusInAndUserIdAndBookItemBookId(
                EnumSet.of(BorrowRequestStatus.PENDING, BorrowRequestStatus.APPROVED),
                user.getId(),
                request.bookId());
        if (hasBorrowSlipForBook) {
            throw new IllegalArgumentException("Bạn đã có phiếu mượn cho sách này, không thể tham gia hàng chờ");
        }

        boolean hasActiveBorrowForBook = borrowRecordRepository
                .existsByUserIdAndBookItemBookIdAndReturnDateIsNull(user.getId(), request.bookId());
        if (hasActiveBorrowForBook) {
            throw new IllegalArgumentException("Bạn đang mượn sách này, không thể tham gia hàng chờ");
        }

        List<ReservationStatus> activeStatuses = List.of(ReservationStatus.PENDING, ReservationStatus.NOTIFIED);
        boolean hasActiveReservation = reservationRepository.existsByUserIdAndBookIdAndStatusIn(
                user.getId(),
                request.bookId(),
                activeStatuses);
        if (hasActiveReservation) {
            throw new IllegalArgumentException("Bạn đã đặt trước sách này rồi");
        }

        long activeReservationCount = reservationRepository.countByUserIdAndStatusIn(user.getId(), activeStatuses);
        if (activeReservationCount >= MAX_ACTIVE_RESERVATIONS) {
            throw new IllegalArgumentException("Bạn đã đạt giới hạn tối đa 3 sách đặt trước");
        }

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setBook(book);
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setCreatedAt(LocalDateTime.now());
        Reservation saved = reservationRepository.save(reservation);

        int position = waitlistPosition(saved);
        return new WaitlistResponse("Đăng ký danh sách chờ thành công", request.bookId(), position);
    }

    @Override
    public WaitlistResponse cancelReservation(Long reservationId, String username) {
        User user = userContextService.resolveUser(username);
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy yêu cầu đặt trước"));

        if (!Objects.equals(reservation.getUser().getId(), user.getId())) {
            throw new IllegalArgumentException("Bạn không có quyền hủy yêu cầu đặt trước này");
        }
        if (reservation.getStatus() == ReservationStatus.COMPLETED
                || reservation.getStatus() == ReservationStatus.CANCELLED
                || reservation.getStatus() == ReservationStatus.EXPIRED) {
            throw new IllegalArgumentException("Yêu cầu đặt trước đã được xử lý trước đó");
        }

        boolean wasNotified = reservation.getStatus() == ReservationStatus.NOTIFIED;
        Long bookId = reservation.getBook().getId();
        Book book = reservation.getBook();
        BookItem reservedItem = reservation.getBookItem();

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservation.setCancelledAt(LocalDateTime.now());
        reservationRepository.save(reservation);

        if (wasNotified) {
            notificationDispatchService.createAndDispatch(
                user,
                "Bạn đã hủy quyền nhận sách '" + reservation.getBook().getTitle()
                    + "'. Hệ thống sẽ chuyển lượt cho người tiếp theo.");

            if (reservedItem != null) {
                assignNextReservation(book, reservedItem, LocalDateTime.now());
                bookItemRepository.save(reservedItem);
            }
        }

        return new WaitlistResponse("Đã hủy đặt trước", bookId, 0);
    }

    @Override
    public FinesResponse getFines(String username) {
        User user = userContextService.resolveUser(username);

        List<PaidFineHistoryResponse> paidHistory = finePaymentRepository
                .findByBorrowRecordUserIdOrderByPaymentDateDesc(user.getId()).stream()
            .map(payment -> borrowingMapper.toPaidFineHistoryResponse(payment, DEFAULT_PAYMENT_METHOD))
                .toList();

        List<BorrowRecord> unpaidRecords = borrowRecordRepository.findByUserIdOrderByBorrowDateDesc(user.getId())
                .stream()
            .filter(borrowRecord -> borrowRecord.getFineAmount() != null && borrowRecord.getFineAmount() > 0)
                .toList();

        double totalDebt = unpaidRecords.stream().mapToDouble(BorrowRecord::getFineAmount).sum();
        return new FinesResponse(totalDebt, unpaidRecords.size(), paidHistory);
    }

    @Override
    public FinePaymentResponse payFine(PayFineRequest request) {
        if (request.recordId() == null) {
            throw new IllegalArgumentException("recordId không được để trống");
        }

        BorrowRecord borrowRecord = borrowRecordRepository.findById(request.recordId())
            .orElseThrow(() -> new IllegalArgumentException(BORROW_RECORD_NOT_FOUND));

        double currentFine = Objects.requireNonNullElse(borrowRecord.getFineAmount(), 0.0);
        if (currentFine <= 0) {
            throw new IllegalArgumentException("Bản ghi này hiện không có công nợ để thanh toán");
        }

        Double requestedAmount = request.amount();
        double amountToPay = currentFine;
        if (requestedAmount != null) {
            amountToPay = requestedAmount;
        }
        if (amountToPay > currentFine) {
            throw new IllegalArgumentException("Số tiền thanh toán không được lớn hơn công nợ hiện tại");
        }

        FinePayment payment = new FinePayment();
        payment.setBorrowRecord(borrowRecord);
        payment.setAmount(amountToPay);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentMethod(request.paymentMethod() == null || request.paymentMethod().isBlank()
                ? DEFAULT_PAYMENT_METHOD
                : request.paymentMethod());
        finePaymentRepository.save(payment);

        borrowRecord.setFineAmount(Math.max(0.0, currentFine - amountToPay));
        borrowRecordRepository.save(borrowRecord);
        debtRestrictionService.refreshDebtStatus(borrowRecord.getUser());
        auditLogService.log(
                borrowRecord.getUser().getUsername(),
                "PAY_FINE",
                "BORROW_RECORD",
                String.valueOf(borrowRecord.getId()),
                "paymentId=" + payment.getId() + ", amount=" + amountToPay);

        return new FinePaymentResponse("Thanh toán thành công", payment.getId());
    }

    @Override
    public RecalculateFineResponse recalculateFine(RecalculateFineRequest request) {
        if (request.recordId() == null) {
            throw new IllegalArgumentException("recordId không được để trống");
        }

        BorrowRecord borrowRecord = borrowRecordRepository.findById(request.recordId())
            .orElseThrow(() -> new IllegalArgumentException(BORROW_RECORD_NOT_FOUND));

        if (borrowRecord.getReturnDate() == null && borrowRecord.getDueDate() != null
            && borrowRecord.getDueDate().isBefore(LocalDateTime.now())) {
            long lateDays = ChronoUnit.DAYS.between(borrowRecord.getDueDate(), LocalDateTime.now());
            borrowRecord.setFineAmount(Math.max(0, lateDays) * DAILY_FINE);
            borrowRecordRepository.save(borrowRecord);
        }

        return new RecalculateFineResponse(request.recordId(), borrowRecord.getFineAmount());
    }

    private boolean isLibrarian(User user) {
        return user.getRoles().stream()
                .map(Role::getName)
                .anyMatch(name -> name.equals("ROLE_LIBRARIAN"));
    }

    private int waitlistPosition(Reservation reservation) {
        List<Reservation> queue = reservationRepository.findByBookIdAndStatusOrderByCreatedAtAsc(
                reservation.getBook().getId(),
                ReservationStatus.PENDING);
        for (int i = 0; i < queue.size(); i++) {
            if (Objects.equals(queue.get(i).getId(), reservation.getId())) {
                return i + 1;
            }
        }
        return 0;
    }

    private void assignNextReservation(Book book, BookItem item, LocalDateTime now) {
        Optional<Reservation> next = reservationRepository.findFirstByBookIdAndStatusOrderByCreatedAtAsc(
                book.getId(),
                ReservationStatus.PENDING);
        if (next.isPresent()) {
            Reservation reservation = next.get();
            reservation.setStatus(ReservationStatus.NOTIFIED);
            reservation.setBookItem(item);
            reservation.setNotifiedAt(now);
            reservation.setExpiryDate(now.plusHours(24));
            reservationRepository.save(reservation);

            item.setStatus(com.example.demo.model.BookStatus.RESERVED);
                notificationDispatchService.createAndDispatch(
                    reservation.getUser(),
                    "Sách '" + reservation.getBook().getTitle()
                        + "' đã về! Bạn có 24h (đến " + reservation.getExpiryDate() + ") để đến nhận.");
            return;
        }

        item.setStatus(com.example.demo.model.BookStatus.AVAILABLE);
    }

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void processOverdueBorrowRecords() {
        LocalDateTime now = LocalDateTime.now();
        List<BorrowRecord> overdueRecords = borrowRecordRepository
                .findByReturnDateIsNullAndStatusInAndDueDateBefore(OVERDUE_SCAN_STATUSES, now);

        for (BorrowRecord borrowRecord : overdueRecords) {
            if (borrowRecord.getStatus() == BookStatus.BORROWING) {
                borrowRecord.setStatus(BookStatus.OVERDUE);
            }

            double currentFine = Objects.requireNonNullElse(borrowRecord.getFineAmount(), 0.0);
            double updatedFine = currentFine + overdueDailyFine;
            borrowRecord.setFineAmount(updatedFine);
            borrowRecordRepository.save(borrowRecord);

            long overdueDays = Math.max(1,
                    ChronoUnit.DAYS.between(borrowRecord.getDueDate().toLocalDate(), now.toLocalDate()));
                String overdueBookTitle = Optional.ofNullable(borrowRecord.getBookItem())
                    .map(BookItem::getBook)
                    .map(Book::getTitle)
                    .orElse("Không rõ tên sách");

            User borrower = borrowRecord.getUser();
            if (overdueDays > overdueLockDaysThreshold || updatedFine >= overdueLockFineThreshold) {
                borrower.setBorrowingLocked(true);
                userRepository.save(borrower);
            }
            debtRestrictionService.refreshDebtStatus(borrower);

            notificationDispatchService.createAndDispatch(
                    borrower,
                    "Bạn có sách quá hạn " + overdueDays + " ngày. Tổng phí phạt hiện tại: "
                            + Math.round(updatedFine)
                        + " VND. Vui lòng trả sách và nộp phạt để tiếp tục sử dụng dịch vụ.",
                    "mail/overdue-reminder",
                    Map.of(
                        "bookTitle", overdueBookTitle,
                        "dueDate", borrowRecord.getDueDate(),
                        "daysOverdue", overdueDays));
            auditLogService.log(
                    "SYSTEM",
                    "AUTO_OVERDUE_UPDATE",
                    "BORROW_RECORD",
                    String.valueOf(borrowRecord.getId()),
                    "overdueDays=" + overdueDays + ", fine=" + Math.round(updatedFine));
        }
    }
}
