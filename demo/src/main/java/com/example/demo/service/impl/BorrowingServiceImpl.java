package com.example.demo.service.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.EnumSet;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

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
import com.example.demo.model.BorrowRecord;
import com.example.demo.model.BorrowRequestStatus;
import com.example.demo.model.FinePayment;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.BorrowRecordRepository;
import com.example.demo.repository.BorrowRequestRepository;
import com.example.demo.repository.FinePaymentRepository;
import com.example.demo.service.BorrowingService;
import com.example.demo.service.ModuleStateService;
import com.example.demo.service.UserContextService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BorrowingServiceImpl implements BorrowingService {

    private static final String DEFAULT_PAYMENT_METHOD = "ONLINE";
    private static final double DAILY_FINE = 5000.0;

    private final UserContextService userContextService;
    private final ModuleStateService moduleStateService;
    private final BorrowRecordRepository borrowRecordRepository;
    private final BorrowRequestRepository borrowRequestRepository;
    private final FinePaymentRepository finePaymentRepository;
    private final BookRepository bookRepository;
    private final BorrowingMapper borrowingMapper;

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
            .map(borrowingMapper::toBorrowRecordResponse)
                .toList();
    }

    @Override
    public List<WaitlistItemResponse> getMyWaitlist(String username) {
        User user = userContextService.resolveUser(username);
        return moduleStateService.getWaitlistBookIdsForUser(user.getId()).stream()
                .map(bookId -> {
                    String title = bookRepository.findById(bookId)
                            .map(book -> book.getTitle())
                            .orElse("Sách #" + bookId);
                    int position = moduleStateService.waitlistPosition(user.getId(), bookId);
                    return new WaitlistItemResponse(bookId, title, position);
                })
                .toList();
    }

    @Override
    public RenewRecordResponse renew(Long recordId) {
        BorrowRecord record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bản ghi mượn"));
        if (record.getReturnDate() != null) {
            throw new IllegalArgumentException("Sách đã trả, không thể gia hạn");
        }
        record.setDueDate(record.getDueDate().plusDays(7));
        borrowRecordRepository.save(record);
        return new RenewRecordResponse("Gia hạn thành công", record.getDueDate());
    }

    @Override
    public WaitlistResponse joinWaitlist(WaitlistRequest request) {
        if (request.bookId() == null) {
            throw new IllegalArgumentException("bookId không được để trống");
        }
        User user = userContextService.resolveUser(request.username());

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

        moduleStateService.joinWaitlist(user.getId(), request.bookId());
        int position = moduleStateService.waitlistPosition(user.getId(), request.bookId());
        return new WaitlistResponse("Đăng ký danh sách chờ thành công", request.bookId(), position);
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
                .filter(record -> record.getFineAmount() != null && record.getFineAmount() > 0)
                .toList();

        double totalDebt = unpaidRecords.stream().mapToDouble(BorrowRecord::getFineAmount).sum();
        return new FinesResponse(totalDebt, unpaidRecords.size(), paidHistory);
    }

    @Override
    public FinePaymentResponse payFine(PayFineRequest request) {
        if (request.recordId() == null) {
            throw new IllegalArgumentException("recordId không được để trống");
        }

        BorrowRecord record = borrowRecordRepository.findById(request.recordId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bản ghi mượn"));

        FinePayment payment = new FinePayment();
        payment.setBorrowRecord(record);
        payment.setAmount(Objects.requireNonNullElse(record.getFineAmount(), 0.0));
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentMethod(request.paymentMethod() == null || request.paymentMethod().isBlank()
                ? DEFAULT_PAYMENT_METHOD
                : request.paymentMethod());
        finePaymentRepository.save(payment);

        record.setFineAmount(0.0);
        borrowRecordRepository.save(record);

        return new FinePaymentResponse("Thanh toán thành công", payment.getId());
    }

    @Override
    public RecalculateFineResponse recalculateFine(RecalculateFineRequest request) {
        if (request.recordId() == null) {
            throw new IllegalArgumentException("recordId không được để trống");
        }

        BorrowRecord record = borrowRecordRepository.findById(request.recordId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bản ghi mượn"));

        if (record.getReturnDate() == null && record.getDueDate() != null && record.getDueDate().isBefore(LocalDateTime.now())) {
            long lateDays = ChronoUnit.DAYS.between(record.getDueDate(), LocalDateTime.now());
            record.setFineAmount(Math.max(0, lateDays) * DAILY_FINE);
            borrowRecordRepository.save(record);
        }

        return new RecalculateFineResponse(request.recordId(), record.getFineAmount());
    }

    private boolean isLibrarian(User user) {
        return user.getRoles().stream()
                .map(Role::getName)
                .anyMatch(name -> name.equals("ROLE_LIBRARIAN"));
    }
}
