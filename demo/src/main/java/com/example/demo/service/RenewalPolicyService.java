package com.example.demo.service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.EnumSet;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.demo.model.BorrowRecord;
import com.example.demo.model.BorrowRequestStatus;
import com.example.demo.model.BorrowRequestType;
import com.example.demo.model.ReservationStatus;
import com.example.demo.model.User;
import com.example.demo.repository.BorrowRecordRepository;
import com.example.demo.repository.BorrowRequestRepository;
import com.example.demo.repository.ReservationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RenewalPolicyService {

    @Value("${app.renewal.window-days:3}")
    private int renewalWindowDays;

    @Value("${app.renewal.extension-days:7}")
    private int renewalExtensionDays;

    private final ReservationRepository reservationRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final BorrowRequestRepository borrowRequestRepository;

    public record RenewalDecision(boolean allowed, String reason, long daysUntilDue) {
    }

    public RenewalDecision evaluate(BorrowRecord borrowRecord) {
        if (borrowRecord.getReturnDate() != null) {
            return new RenewalDecision(false, "Sách đã trả, không thể gia hạn", -1);
        }
        if (borrowRecord.getDueDate() == null) {
            return new RenewalDecision(false, "Phiếu mượn không có hạn trả hợp lệ", -1);
        }

        LocalDateTime now = LocalDateTime.now();
        long daysUntilDue = ChronoUnit.DAYS.between(now, borrowRecord.getDueDate());
        if (borrowRecord.getDueDate().isBefore(now)) {
            return new RenewalDecision(false, "Sách đã quá hạn, vui lòng đến quầy để xử lý", daysUntilDue);
        }

        User borrower = borrowRecord.getUser();
        int monthlyLimit = monthlyLimitForUser(borrower);
        long monthlyRenewals = approvedRenewalsThisMonth(borrower.getId());
        if (monthlyRenewals >= monthlyLimit) {
            return new RenewalDecision(false, "Bạn đã đạt giới hạn gia hạn trong tháng", daysUntilDue);
        }

        boolean hasPendingReservation = reservationRepository.existsByBookIdAndStatusIn(
                borrowRecord.getBookItem().getBook().getId(),
                EnumSet.of(ReservationStatus.PENDING, ReservationStatus.NOTIFIED));
        if (hasPendingReservation) {
            return new RenewalDecision(false, "Sách đang có người trong hàng chờ, không thể gia hạn", daysUntilDue);
        }

        double outstandingDebt = borrowRecordRepository.sumOutstandingDebtByUserId(borrowRecord.getUser().getId());
        if (outstandingDebt > 0) {
            return new RenewalDecision(false, "Tài khoản còn nợ phạt chưa thanh toán", daysUntilDue);
        }

        if (daysUntilDue >= renewalWindowDays) {
            return new RenewalDecision(false, "Chỉ được gia hạn khi hạn trả còn dưới 3 ngày", daysUntilDue);
        }

        return new RenewalDecision(true, null, daysUntilDue);
    }

    public RenewalDecision evaluateForRenewalRequest(BorrowRecord borrowRecord) {
        RenewalDecision baseDecision = evaluate(borrowRecord);
        if (!baseDecision.allowed()) {
            return baseDecision;
        }

        boolean hasPendingRenewalRequest = borrowRequestRepository.existsByStatusAndRequestTypeAndBorrowRecordId(
                BorrowRequestStatus.PENDING,
                BorrowRequestType.RENEWAL,
                borrowRecord.getId());
        if (hasPendingRenewalRequest) {
            return new RenewalDecision(false, "Phiếu mượn này đã có yêu cầu gia hạn đang chờ duyệt", baseDecision.daysUntilDue());
        }

        User borrower = borrowRecord.getUser();
        int monthlyLimit = monthlyLimitForUser(borrower);
        long requestedThisMonth = borrowRequestRepository.countByUserIdAndRequestTypeAndStatusInAndRequestDateBetween(
                borrower.getId(),
                BorrowRequestType.RENEWAL,
                EnumSet.of(BorrowRequestStatus.PENDING, BorrowRequestStatus.APPROVED),
                monthStart(),
                nextMonthStart());
        if (requestedThisMonth >= monthlyLimit) {
            return new RenewalDecision(false, "Bạn đã đạt giới hạn gửi yêu cầu gia hạn trong tháng", baseDecision.daysUntilDue());
        }

        return baseDecision;
    }

    public LocalDateTime applyRenewal(BorrowRecord borrowRecord) {
        int currentRenewals = borrowRecord.getRenewalCount() == null ? 0 : borrowRecord.getRenewalCount();
        borrowRecord.setDueDate(borrowRecord.getDueDate().plusDays(renewalExtensionDays));
        borrowRecord.setRenewalCount(currentRenewals + 1);
        return borrowRecord.getDueDate();
    }

    public int maxRenewalsForUser(User user) {
        return monthlyLimitForUser(user);
    }

    private int monthlyLimitForUser(User user) {
        String membershipName = user.getMembershipType() == null || user.getMembershipType().getName() == null
                ? ""
                : user.getMembershipType().getName().trim();
        if ("Premium".equalsIgnoreCase(membershipName)) {
            return 5;
        }
        return 3;
    }

    private long approvedRenewalsThisMonth(Long userId) {
        return borrowRequestRepository.countByUserIdAndRequestTypeAndStatusAndRequestDateBetween(
                userId,
                BorrowRequestType.RENEWAL,
                BorrowRequestStatus.APPROVED,
                monthStart(),
                nextMonthStart());
    }

    private LocalDateTime monthStart() {
        YearMonth month = YearMonth.now();
        return month.atDay(1).atStartOfDay();
    }

    private LocalDateTime nextMonthStart() {
        YearMonth month = YearMonth.now().plusMonths(1);
        return month.atDay(1).atStartOfDay();
    }
}
