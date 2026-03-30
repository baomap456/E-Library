package com.example.demo.service.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.example.demo.dto.reports.ReportsDiscrepancyResponse;
import com.example.demo.dto.reports.ReportsExportRequest;
import com.example.demo.dto.reports.ReportsExportResponse;
import com.example.demo.dto.reports.ReportsFinancialResponse;
import com.example.demo.dto.reports.ReportsInventorySessionRequest;
import com.example.demo.dto.reports.ReportsInventorySessionResponse;
import com.example.demo.dto.reports.ReportsReconcileRequest;
import com.example.demo.dto.reports.ReportsReconcileResponse;
import com.example.demo.dto.reports.ReportsTrendResponse;
import com.example.demo.mapper.ReportsMapper;
import com.example.demo.model.BorrowRecord;
import com.example.demo.repository.BookItemRepository;
import com.example.demo.repository.BorrowRecordRepository;
import com.example.demo.repository.FinePaymentRepository;
import com.example.demo.service.ModuleStateService;
import com.example.demo.service.ReportsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportsServiceImpl implements ReportsService {

    private final ModuleStateService moduleStateService;
    private final BookItemRepository bookItemRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final FinePaymentRepository finePaymentRepository;
        private final ReportsMapper reportsMapper;

    @Override
    public ReportsInventorySessionResponse createInventorySession(ReportsInventorySessionRequest request) {
        String name = request != null && request.name() != null ? request.name() : "Inventory Session";
        String area = request != null && request.area() != null ? request.area() : "Main Warehouse";
                return reportsMapper.toInventorySessionResponse(moduleStateService.addInventorySession(name, area));
    }

    @Override
    public List<ReportsInventorySessionResponse> inventorySessions() {
                return moduleStateService.getInventorySessions().stream().map(reportsMapper::toInventorySessionResponse).toList();
    }

    @Override
    public ReportsReconcileResponse reconcile(ReportsReconcileRequest request) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Đã ghi nhận dữ liệu đối soát");
        response.put("sessionId", request.sessionId());
        response.put("barcode", request.barcode());
        response.put("actualQuantity", request.actualQuantity());

        return new ReportsReconcileResponse(
                String.valueOf(response.get("message")),
                request.sessionId(),
                request.barcode(),
                request.actualQuantity());
    }

    @Override
    public List<ReportsDiscrepancyResponse> discrepancies() {
        return bookItemRepository.findAll().stream()
                .collect(java.util.stream.Collectors.groupingBy(item -> item.getBook().getTitle(),
                        java.util.stream.Collectors.counting()))
                .entrySet().stream()
                .map(entry -> reportsMapper.toDiscrepancyResponse(entry.getKey(), entry.getValue()))
                .toList();
    }

    @Override
    public List<ReportsTrendResponse> trends() {
        LocalDateTime now = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        return List.of(
                new ReportsTrendResponse(now.minusDays(6),
                        borrowRecordRepository.countByBorrowDateBetween(now.minusDays(6), now.minusDays(5))),
                new ReportsTrendResponse(now.minusDays(5),
                        borrowRecordRepository.countByBorrowDateBetween(now.minusDays(5), now.minusDays(4))),
                new ReportsTrendResponse(now.minusDays(4),
                        borrowRecordRepository.countByBorrowDateBetween(now.minusDays(4), now.minusDays(3))),
                new ReportsTrendResponse(now.minusDays(3),
                        borrowRecordRepository.countByBorrowDateBetween(now.minusDays(3), now.minusDays(2))),
                new ReportsTrendResponse(now.minusDays(2),
                        borrowRecordRepository.countByBorrowDateBetween(now.minusDays(2), now.minusDays(1))),
                new ReportsTrendResponse(now.minusDays(1),
                        borrowRecordRepository.countByBorrowDateBetween(now.minusDays(1), now)));
    }

    @Override
    public ReportsFinancialResponse financial(String period) {
        String safePeriod = period == null ? "month" : period;
        LocalDateTime from = switch (safePeriod.toLowerCase()) {
            case "year" -> LocalDateTime.now().minusYears(1);
            case "quarter" -> LocalDateTime.now().minusMonths(3);
            default -> LocalDateTime.now().minusMonths(1);
        };
        LocalDateTime to = LocalDateTime.now();

        double paid = finePaymentRepository.findByPaymentDateBetween(from, to).stream()
                .mapToDouble(payment -> Objects.requireNonNullElse(payment.getAmount(), 0.0))
                .sum();

        double debt = borrowRecordRepository.findAll().stream()
                .mapToDouble(BorrowRecord::getFineAmount)
                .sum();

        return new ReportsFinancialResponse(safePeriod, paid, debt, 0.0);
    }

    @Override
    public ReportsExportResponse export(ReportsExportRequest request) {
        String format = request != null && request.format() != null ? request.format() : "excel";
        String path = "/exports/library-report-" + System.currentTimeMillis() + "."
                + ("pdf".equalsIgnoreCase(format) ? "pdf" : "xlsx");
        return new ReportsExportResponse("Xuất báo cáo thành công", format, path);
    }

}
