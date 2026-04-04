package com.example.demo.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.demo.model.BorrowRecord;
import com.example.demo.model.ReservationStatus;
import com.example.demo.repository.BorrowRecordRepository;
import com.example.demo.repository.ReservationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RenewalPolicyService {

    @Value("${app.renewal.max-renewals:2}")
    private int maxRenewals;

    @Value("${app.renewal.window-days:3}")
    private int renewalWindowDays;

    @Value("${app.renewal.extension-days:7}")
    private int renewalExtensionDays;

    private final ReservationRepository reservationRepository;
    private final BorrowRecordRepository borrowRecordRepository;

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

        int currentRenewals = borrowRecord.getRenewalCount() == null ? 0 : borrowRecord.getRenewalCount();
        if (currentRenewals >= maxRenewals) {
            return new RenewalDecision(false, "Đã đạt giới hạn gia hạn", daysUntilDue);
        }

        boolean hasPendingReservation = reservationRepository.existsByBookIdAndStatus(
                borrowRecord.getBookItem().getBook().getId(),
                ReservationStatus.PENDING);
        if (hasPendingReservation) {
            return new RenewalDecision(false, "Sách đang có người đặt trước, không thể gia hạn", daysUntilDue);
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

    public LocalDateTime applyRenewal(BorrowRecord borrowRecord) {
        int currentRenewals = borrowRecord.getRenewalCount() == null ? 0 : borrowRecord.getRenewalCount();
        borrowRecord.setDueDate(borrowRecord.getDueDate().plusDays(renewalExtensionDays));
        borrowRecord.setRenewalCount(currentRenewals + 1);
        return borrowRecord.getDueDate();
    }

    public int maxRenewals() {
        return maxRenewals;
    }
}
