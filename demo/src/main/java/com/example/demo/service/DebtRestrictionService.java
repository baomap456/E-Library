package com.example.demo.service;

import org.springframework.stereotype.Service;

import com.example.demo.model.User;
import com.example.demo.repository.BorrowRecordRepository;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DebtRestrictionService {

    private final BorrowRecordRepository borrowRecordRepository;
    private final UserRepository userRepository;

    public void assertBorrowingAllowed(User user, String actionLabel) {
        refreshDebtStatus(user);
        if (Boolean.TRUE.equals(user.isBorrowingLocked())) {
            throw new IllegalArgumentException(
                    "Tài khoản đang có nợ chưa thanh toán, không thể " + actionLabel + " cho đến khi trả hết nợ");
        }
    }

    public double refreshDebtStatus(User user) {
        Double debt = borrowRecordRepository.sumOutstandingDebtByUserId(user.getId());
        double outstandingDebt = debt == null ? 0.0 : debt;
        user.setOutstandingDebt(outstandingDebt);
        user.setBorrowingLocked(outstandingDebt > 0);
        userRepository.save(user);
        return outstandingDebt;
    }
}
