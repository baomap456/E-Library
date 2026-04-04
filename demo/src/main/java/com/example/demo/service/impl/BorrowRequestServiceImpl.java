package com.example.demo.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.borrowing.ApproveBorrowRequestDto;
import com.example.demo.dto.borrowing.BorrowRequestResponse;
import com.example.demo.dto.borrowing.CreateBorrowRequestDto;
import com.example.demo.mapper.BorrowingMapper;
import com.example.demo.model.BookItem;
import com.example.demo.model.BookStatus;
import com.example.demo.model.BorrowRecord;
import com.example.demo.model.BorrowRequest;
import com.example.demo.model.BorrowRequestStatus;
import com.example.demo.model.ReservationStatus;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.BookItemRepository;
import com.example.demo.repository.BorrowRecordRepository;
import com.example.demo.repository.BorrowRequestRepository;
import com.example.demo.repository.ReservationRepository;
import com.example.demo.service.BorrowRequestService;
import com.example.demo.service.DebtRestrictionService;
import com.example.demo.service.NotificationDispatchService;
import com.example.demo.service.UserContextService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BorrowRequestServiceImpl implements BorrowRequestService {

    private final BorrowRequestRepository borrowRequestRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final BookItemRepository bookItemRepository;
    private final ReservationRepository reservationRepository;
    private final NotificationDispatchService notificationDispatchService;
    private final UserContextService userContextService;
    private final BorrowingMapper borrowingMapper;
    private final DebtRestrictionService debtRestrictionService;

    @Scheduled(cron = "0 15 1 * * *")
    @Transactional
    public void autoCancelExpiredPickupRequests() {
        LocalDate today = LocalDate.now();
        List<BorrowRequest> expiredRequests = borrowRequestRepository
                .findByStatusAndRequestedPickupDateBefore(BorrowRequestStatus.PENDING, today);

        for (BorrowRequest request : expiredRequests) {
            request.setStatus(BorrowRequestStatus.CANCELLED);
            request.setApprovalDate(LocalDateTime.now());
            request.setApprovalNote("Quá hạn ngày lấy sách, hệ thống tự hủy phiếu");

            // Release reserved copy back to shelf when request is auto-cancelled.
            if (request.getBookItem() != null && request.getBookItem().getStatus() == BookStatus.RESERVED) {
                request.getBookItem().setStatus(BookStatus.AVAILABLE);
                bookItemRepository.save(request.getBookItem());
            }

            borrowRequestRepository.save(request);

                notificationDispatchService.createAndDispatch(
                    request.getUser(),
                    "Phiếu mượn #" + request.getId()
                        + " đã bị hủy do quá hạn ngày lấy sách ("
                        + request.getRequestedPickupDate() + ").",
                    "mail/pickup-request-expired",
                    Map.of(
                        "requestId", request.getId(),
                        "pickupDate", request.getRequestedPickupDate(),
                        "approvalDate", request.getApprovalDate()));
        }
    }

    @Override
    @Transactional
    public BorrowRequestResponse createBorrowRequest(CreateBorrowRequestDto request) {
        User user = userContextService.resolveUser(request.username());
        debtRestrictionService.assertBorrowingAllowed(user, "gửi yêu cầu mượn");
        
        // Check if user is a librarian
        if (isLibrarian(user)) {
            throw new IllegalArgumentException("Thủ thư không thể gửi yêu cầu mượn sách");
        }

        if (request.bookId() == null) {
            throw new IllegalArgumentException("Bạn phải chọn sách trước khi gửi yêu cầu mượn");
        }
        if (request.requestedPickupDate() == null) {
            throw new IllegalArgumentException("Bạn phải chọn ngày lấy sách");
        }
        if (request.requestedReturnDate() == null) {
            throw new IllegalArgumentException("Bạn phải chọn ngày trả dự kiến");
        }

        LocalDate today = LocalDate.now();
        if (request.requestedPickupDate().isBefore(today)) {
            throw new IllegalArgumentException("Ngày lấy sách không được ở quá khứ");
        }
        if (!request.requestedReturnDate().isAfter(request.requestedPickupDate())) {
            throw new IllegalArgumentException("Ngày trả dự kiến phải sau ngày lấy sách và không được trùng ngày lấy sách");
        }
        if (!request.requestedReturnDate().isAfter(today)) {
            throw new IllegalArgumentException("Ngày trả dự kiến phải sau ngày hiện tại");
        }

        int maxBooks = user.getMembershipType() != null
                ? user.getMembershipType().getMaxBooks()
                : 3;
        long activeBorrowings = borrowRecordRepository.countByUserIdAndReturnDateIsNull(user.getId());
        long pendingBorrowRequests = borrowRequestRepository.countByStatusAndUserId(BorrowRequestStatus.PENDING, user.getId());
        if (activeBorrowings + pendingBorrowRequests >= maxBooks) {
            throw new IllegalArgumentException("Bạn đã vượt mức phiếu mượn tối đa của gói hiện tại");
        }

        int maxBorrowDays = user.getMembershipType() != null
                ? user.getMembershipType().getBorrowDurationDays()
                : 14;
        LocalDate maxAllowedReturnDate = request.requestedPickupDate().plusDays(maxBorrowDays);
        if (request.requestedReturnDate().isAfter(maxAllowedReturnDate)) {
            throw new IllegalArgumentException("Ngày trả dự kiến vượt quá thời hạn mượn cho phép của gói hiện tại");
        }

        // Check if user already has a pending request for this book
        boolean hasPendingForSameBook = borrowRequestRepository.existsByStatusAndUserIdAndBookItemBookId(
            BorrowRequestStatus.PENDING,
            user.getId(),
            request.bookId());
        if (hasPendingForSameBook) {
            throw new IllegalArgumentException("Bạn đã có yêu cầu mượn sách này đang chờ duyệt");
        }

        long physicalAvailable = bookItemRepository.countByBookIdAndStatus(request.bookId(), BookStatus.AVAILABLE);
        long waitingUsers = reservationRepository.countByBookIdAndStatusIn(
                request.bookId(),
                EnumSet.of(ReservationStatus.PENDING, ReservationStatus.NOTIFIED));
        if (waitingUsers > 0) {
            throw new IllegalArgumentException("Sách này đang có người chờ. Bạn cần tham gia hàng chờ thay vì lập phiếu mượn trực tiếp");
        }
        if (physicalAvailable <= 0) {
            throw new IllegalArgumentException("Sách đã hết số lượng khả dụng. Vui lòng tham gia hàng chờ");
        }

        BookItem bookItem = bookItemRepository.findByBookId(request.bookId()).stream()
            .filter(item -> item.getStatus() == BookStatus.AVAILABLE)
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Hiện không còn bản sách khả dụng để lập phiếu mượn"));

        BorrowRequest borrowRequest = new BorrowRequest();
        borrowRequest.setUser(user);
        borrowRequest.setBookItem(bookItem);
        borrowRequest.setStatus(BorrowRequestStatus.PENDING);
        borrowRequest.setRequestDate(LocalDateTime.now());
        borrowRequest.setRequestedPickupDate(request.requestedPickupDate());
        borrowRequest.setRequestedReturnDate(request.requestedReturnDate());

        // Reserve selected copy immediately so stock reflects pending requests in real time.
        bookItem.setStatus(BookStatus.RESERVED);
        bookItemRepository.save(bookItem);

        BorrowRequest saved = borrowRequestRepository.save(borrowRequest);
        return borrowingMapper.toBorrowRequestResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BorrowRequestResponse> getPendingRequests() {
        User librarian = userContextService.getCurrentUser();
        if (!isLibrarian(librarian)) {
            throw new IllegalArgumentException("Chỉ thủ thư mới có quyền xem yêu cầu mượn");
        }

        return borrowRequestRepository.findByStatusOrderByRequestDateDesc(BorrowRequestStatus.PENDING)
                .stream()
                .map(borrowingMapper::toBorrowRequestResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BorrowRequestResponse> getAllRequests() {
        User librarian = userContextService.getCurrentUser();
        if (!isLibrarian(librarian)) {
            throw new IllegalArgumentException("Chỉ thủ thư mới có quyền xem các yêu cầu mượn");
        }

        return borrowRequestRepository.findAll().stream()
                .map(borrowingMapper::toBorrowRequestResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BorrowRequestResponse> getMyRequests(String username) {
        User user = userContextService.resolveUser(username);
        return borrowRequestRepository.findByUserIdOrderByRequestDateDesc(user.getId())
                .stream()
                .map(borrowingMapper::toBorrowRequestResponse)
                .toList();
    }

    @Override
    @Transactional
    public BorrowRequestResponse processBorrowRequest(ApproveBorrowRequestDto dto) {
        User librarian = userContextService.getCurrentUser();
        if (!isLibrarian(librarian)) {
            throw new IllegalArgumentException("Chỉ thủ thư mới có quyền duyệt yêu cầu mượn");
        }

        BorrowRequest request = borrowRequestRepository.findById(dto.requestId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy yêu cầu mượn"));

        if (!request.getStatus().equals(BorrowRequestStatus.PENDING)) {
            throw new IllegalArgumentException("Yêu cầu mượn này đã được xử lý");
        }

        if (dto.approve()) {
            BookStatus currentStatus = request.getBookItem().getStatus();
            if (currentStatus != BookStatus.AVAILABLE && currentStatus != BookStatus.RESERVED) {
                throw new IllegalArgumentException("Sách không còn khả dụng để duyệt mượn");
            }

            // Approve: Create BorrowRecord
            BorrowRecord borrowRecord = new BorrowRecord();
            borrowRecord.setUser(request.getUser());
            borrowRecord.setBookItem(request.getBookItem());
            borrowRecord.setBorrowDate(LocalDateTime.now());
            if (request.getRequestedReturnDate() != null) {
                borrowRecord.setDueDate(request.getRequestedReturnDate().atTime(23, 59, 59));
            } else {
                int borrowDays = request.getUser().getMembershipType() != null
                        ? request.getUser().getMembershipType().getBorrowDurationDays()
                        : 14;
                borrowRecord.setDueDate(LocalDateTime.now().plusDays(borrowDays));
            }
            borrowRecord.setFineAmount(0.0);
            borrowRecordRepository.save(borrowRecord);

            request.getBookItem().setStatus(BookStatus.BORROWING);
            bookItemRepository.save(request.getBookItem());

            request.setStatus(BorrowRequestStatus.APPROVED);
            request.setApprovalDate(LocalDateTime.now());
            request.setApprovedBy(librarian);
            request.setApprovalNote(dto.note() != null ? dto.note() : "Được duyệt");
        } else {
            // Reject
            if (request.getBookItem() != null && request.getBookItem().getStatus() == BookStatus.RESERVED) {
                request.getBookItem().setStatus(BookStatus.AVAILABLE);
                bookItemRepository.save(request.getBookItem());
            }

            request.setStatus(BorrowRequestStatus.REJECTED);
            request.setApprovalDate(LocalDateTime.now());
            request.setApprovedBy(librarian);
            request.setApprovalNote(dto.note() != null ? dto.note() : "Bị từ chối");
        }

        BorrowRequest updated = borrowRequestRepository.save(request);
        return borrowingMapper.toBorrowRequestResponse(updated);
    }

    @Override
    @Transactional
    public BorrowRequestResponse cancelRequest(Long requestId) {
        BorrowRequest request = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy yêu cầu mượn"));

        // User can only cancel their own requests
        User currentUser = userContextService.getCurrentUser();
        if (!request.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Bạn không có quyền hủy yêu cầu này");
        }

        if (!request.getStatus().equals(BorrowRequestStatus.PENDING)) {
            throw new IllegalArgumentException("Chỉ có thể hủy yêu cầu đang chờ duyệt");
        }

        if (request.getBookItem() != null && request.getBookItem().getStatus() == BookStatus.RESERVED) {
            request.getBookItem().setStatus(BookStatus.AVAILABLE);
            bookItemRepository.save(request.getBookItem());
        }

        request.setStatus(BorrowRequestStatus.CANCELLED);
        request.setApprovalDate(LocalDateTime.now());
        request.setApprovalNote("Người dùng hủy phiếu mượn");
        BorrowRequest updated = borrowRequestRepository.save(request);
        return borrowingMapper.toBorrowRequestResponse(updated);
    }

    private boolean isLibrarian(User user) {
        return user.getRoles().stream()
                .map(Role::getName)
                .anyMatch(name -> name.equals("ROLE_LIBRARIAN") || name.equals("ROLE_ADMIN"));
    }

}
