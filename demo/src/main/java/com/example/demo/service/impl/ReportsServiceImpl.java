package com.example.demo.service.impl;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.reports.ReportsAuditLogResponse;
import com.example.demo.dto.reports.ReportsCategoryShareResponse;
import com.example.demo.dto.reports.ReportsDigitalAuditItemResponse;
import com.example.demo.dto.reports.ReportsDigitalAuditResponse;
import com.example.demo.dto.reports.ReportsDiscardBooksRequest;
import com.example.demo.dto.reports.ReportsDiscardBooksResponse;
import com.example.demo.dto.reports.ReportsDiscardCandidateResponse;
import com.example.demo.dto.reports.ReportsDiscardReportDetailResponse;
import com.example.demo.dto.reports.ReportsDiscardReportItemResponse;
import com.example.demo.dto.reports.ReportsDiscardReportSummaryResponse;
import com.example.demo.dto.reports.ReportsDiscardSuggestionsResponse;
import com.example.demo.dto.reports.ReportsDiscrepancyResponse;
import com.example.demo.dto.reports.ReportsExportRequest;
import com.example.demo.dto.reports.ReportsExportResponse;
import com.example.demo.dto.reports.ReportsFinancialResponse;
import com.example.demo.dto.reports.ReportsInventoryBarcodeSearchResponse;
import com.example.demo.dto.reports.ReportsInventoryCloseResponse;
import com.example.demo.dto.reports.ReportsInventoryConflictItemResponse;
import com.example.demo.dto.reports.ReportsInventoryDetailResponse;
import com.example.demo.dto.reports.ReportsInventorySessionRequest;
import com.example.demo.dto.reports.ReportsInventorySessionResponse;
import com.example.demo.dto.reports.ReportsKpiResponse;
import com.example.demo.dto.reports.ReportsMonthlyUserGrowthResponse;
import com.example.demo.dto.reports.ReportsPhysicalAuditRequest;
import com.example.demo.dto.reports.ReportsPhysicalAuditResponse;
import com.example.demo.dto.reports.ReportsReconcileRequest;
import com.example.demo.dto.reports.ReportsReconcileResponse;
import com.example.demo.dto.reports.ReportsTopBookItemResponse;
import com.example.demo.dto.reports.ReportsTrendResponse;
import com.example.demo.mapper.ReportsMapper;
import com.example.demo.model.Book;
import com.example.demo.model.BookItem;
import com.example.demo.model.BookStatus;
import com.example.demo.model.BorrowRecord;
import com.example.demo.model.DiscardReport;
import com.example.demo.model.DiscardReportItem;
import com.example.demo.model.InventoryDetail;
import com.example.demo.model.InventorySession;
import com.example.demo.repository.BookItemRepository;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.BorrowRecordRepository;
import com.example.demo.repository.DiscardReportItemRepository;
import com.example.demo.repository.DiscardReportRepository;
import com.example.demo.repository.FinePaymentRepository;
import com.example.demo.repository.InventoryDetailRepository;
import com.example.demo.repository.InventorySessionRepository;
import com.example.demo.repository.MembershipTransactionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuditLogService;
import com.example.demo.service.ReportsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportsServiceImpl implements ReportsService {

        private static final String PERIOD_MONTH = "month";
    private static final String PERIOD_QUARTER = "quarter";
    private static final String PERIOD_YEAR = "year";
    private static final String ACTOR_LIBRARIAN = "LIBRARIAN";
        private static final String TARGET_BOOK_ITEM = "BOOK_ITEM";
        private static final String STATUS_UNKNOWN = "UNKNOWN";

    private static final Set<BookStatus> ACTIVE_BORROW_STATUSES = Set.of(BookStatus.BORROWING, BookStatus.OVERDUE);
        private static final Set<BookStatus> ACTIVE_INVENTORY_STATUSES = Set.of(
                        BookStatus.AVAILABLE,
                        BookStatus.RESERVED,
                        BookStatus.BORROWING,
                        BookStatus.OVERDUE,
                        BookStatus.LOST,
                        BookStatus.DAMAGED);
        private static final Set<BookStatus> NON_DISCARDABLE_STATUSES = Set.of(BookStatus.BORROWING, BookStatus.OVERDUE, BookStatus.RESERVED);
        private static final String CRITERIA_DAMAGED = "DAMAGED_SEVERE";
        private static final String CRITERIA_LOST_OVER_365 = "LOST_OVER_365_DAYS";
        private static final String CRITERIA_STALE_NO_BORROW = "STALE_5Y_NO_BORROW";
        private static final String CRITERIA_MANUAL = "MANUAL_REVIEW";

        private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
                        .connectTimeout(java.time.Duration.ofSeconds(4))
                        .build();

    private final BookItemRepository bookItemRepository;
        private final BookRepository bookRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final FinePaymentRepository finePaymentRepository;
        private final MembershipTransactionRepository membershipTransactionRepository;
        private final UserRepository userRepository;
        private final InventorySessionRepository inventorySessionRepository;
        private final InventoryDetailRepository inventoryDetailRepository;
        private final DiscardReportRepository discardReportRepository;
        private final DiscardReportItemRepository discardReportItemRepository;
        private final AuditLogService auditLogService;
        private final ReportsMapper reportsMapper;

    @Override
    public ReportsInventorySessionResponse createInventorySession(ReportsInventorySessionRequest request) {
                String name = request != null && request.name() != null ? request.name() : "Phiên kiểm kê";
                String area = request != null && request.area() != null ? request.area() : "Toàn bộ";

                InventorySession session = new InventorySession();
                session.setName(name);
                session.setArea(area);
                session.setStatus("OPEN");
                InventorySession saved = inventorySessionRepository.save(session);

                ReportsInventorySessionResponse response = toInventorySessionResponse(saved);
                auditLogService.log(ACTOR_LIBRARIAN, "CREATE_INVENTORY_SESSION", "INVENTORY_SESSION", String.valueOf(response.id()), "name=" + name + ", area=" + area);
                return response;
    }

    @Override
    public List<ReportsInventorySessionResponse> inventorySessions() {
        return inventorySessionRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toInventorySessionResponse)
                .toList();
    }

        @Override
        public List<ReportsInventoryDetailResponse> inventorySessionDetails(Long sessionId) {
                return inventoryDetailRepository.findBySessionIdOrderByScannedAtDesc(sessionId).stream()
                                .map(detail -> {
                                        BookItem item = bookItemRepository.findByBarcode(detail.getBarcode()).orElse(null);
                                        String title = item == null || item.getBook() == null ? "N/A" : item.getBook().getTitle();
                                        String status = item == null || item.getStatus() == null ? STATUS_UNKNOWN : item.getStatus().name();
                                        String locationLabel = item == null ? "N/A" : buildLocationLabel(item);
                                        return new ReportsInventoryDetailResponse(
                                                        detail.getBarcode(),
                                                        title,
                                                        status,
                                                        locationLabel,
                                                        detail.getScannedAt());
                                })
                                .toList();
        }

    @Override
    public ReportsReconcileResponse reconcile(ReportsReconcileRequest request) {
        InventorySession session = inventorySessionRepository.findById(request.sessionId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiên kiểm kê"));
        if (!"OPEN".equals(session.getStatus())) {
            throw new IllegalArgumentException("Phiên kiểm kê đã đóng");
        }
        BookItem item = bookItemRepository.findByBarcode(request.barcode().trim())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy barcode trong hệ thống"));

        if (!inventoryDetailRepository.existsBySessionIdAndBarcode(session.getId(), item.getBarcode())) {
            InventoryDetail detail = new InventoryDetail();
            detail.setSession(session);
            detail.setBarcode(item.getBarcode());
            inventoryDetailRepository.save(detail);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Đã ghi nhận barcode vào phiên kiểm kê");
        response.put("sessionId", request.sessionId());
        response.put("barcode", item.getBarcode());
        response.put("actualQuantity", request.actualQuantity());

        ReportsReconcileResponse result = new ReportsReconcileResponse(
                String.valueOf(response.get("message")),
                request.sessionId(),
                                item.getBarcode(),
                request.actualQuantity());
                auditLogService.log(ACTOR_LIBRARIAN, "RECONCILE_INVENTORY", TARGET_BOOK_ITEM, item.getBarcode(), "actualQuantity=" + request.actualQuantity());
        return result;
    }

        @Override
        public List<ReportsInventoryBarcodeSearchResponse> searchBarcodes(String keyword) {
                String normalized = keyword == null ? "" : keyword.trim().toLowerCase();
                if (normalized.isBlank()) {
                        return List.of();
                }

                return bookItemRepository.findAll().stream()
                                .filter(item -> item.getBarcode() != null && item.getBarcode().toLowerCase().contains(normalized))
                                .limit(20)
                                .map(item -> new ReportsInventoryBarcodeSearchResponse(
                                                item.getBarcode(),
                                                item.getBook() == null ? "N/A" : item.getBook().getTitle(),
                                                item.getStatus() == null ? STATUS_UNKNOWN : item.getStatus().name(),
                                                buildLocationLabel(item)))
                                .toList();
        }

        @Override
        @Transactional
        public ReportsInventoryCloseResponse closeInventorySession(Long sessionId) {
                        InventorySession session = inventorySessionRepository.findById(sessionId)
                                        .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiên kiểm kê"));
                        if (!"OPEN".equals(session.getStatus())) {
                        throw new IllegalArgumentException("Phiên kiểm kê đã đóng");
                }

                        String scopeArea = session.getArea() == null ? "" : session.getArea().trim();
                        Set<String> scannedBarcodes = inventoryDetailRepository.findBySessionId(sessionId).stream()
                                        .map(InventoryDetail::getBarcode)
                                        .collect(Collectors.toSet());
                List<BookItem> allItems = bookItemRepository.findAll();

                List<BookItem> expectedItems = allItems.stream()
                                .filter(item -> isInScope(item, scopeArea))
                                .filter(item -> item.getStatus() == BookStatus.AVAILABLE)
                                .toList();

                List<BookItem> missingItems = expectedItems.stream()
                                .filter(item -> !scannedBarcodes.contains(item.getBarcode()))
                                .toList();

                missingItems.forEach(item -> item.setStatus(BookStatus.LOST));
                if (!missingItems.isEmpty()) {
                        bookItemRepository.saveAll(missingItems);
                }

                List<ReportsInventoryConflictItemResponse> conflicts = allItems.stream()
                                .filter(item -> scannedBarcodes.contains(item.getBarcode()))
                                .flatMap(item -> buildConflictItems(item, scopeArea).stream())
                                .toList();

                session.setStatus("CLOSED");
                session.setClosedAt(LocalDateTime.now());
                inventorySessionRepository.save(session);

                auditLogService.log(
                                ACTOR_LIBRARIAN,
                                "CLOSE_INVENTORY_SESSION",
                                "INVENTORY_SESSION",
                                String.valueOf(sessionId),
                                "scanned=" + scannedBarcodes.size() + ", missing=" + missingItems.size() + ", conflicts=" + conflicts.size());

                return new ReportsInventoryCloseResponse(
                                sessionId,
                                "CLOSED",
                                scannedBarcodes.size(),
                                Math.max(0, expectedItems.size() - missingItems.size()),
                                missingItems.size(),
                                conflicts.size(),
                                missingItems.stream().map(BookItem::getBarcode).toList(),
                                conflicts,
                                "Đã chốt phiên kiểm kê. Các sách thất lạc được chuyển trạng thái LOST.");
        }

        private ReportsInventorySessionResponse toInventorySessionResponse(InventorySession session) {
                return new ReportsInventorySessionResponse(
                                session.getId(),
                                session.getName(),
                                session.getArea(),
                                session.getStatus(),
                                session.getCreatedAt());
        }

        private String buildLocationLabel(BookItem item) {
                if (item.getLocation() == null) {
                        return "N/A";
                }
                String room = item.getLocation().getRoomName() == null ? "" : item.getLocation().getRoomName();
                String shelf = item.getLocation().getShelfNumber() == null ? "" : item.getLocation().getShelfNumber();
                return (room + " / " + shelf).trim();
        }

        private boolean isInScope(BookItem item, String scopeArea) {
                if (scopeArea == null || scopeArea.isBlank() || "toan bo".equalsIgnoreCase(scopeArea) || "all".equalsIgnoreCase(scopeArea)) {
                        return true;
                }
                if (item.getLocation() == null) {
                        return false;
                }
                String locationText = ((item.getLocation().getRoomName() == null ? "" : item.getLocation().getRoomName())
                                + " "
                                + (item.getLocation().getShelfNumber() == null ? "" : item.getLocation().getShelfNumber()))
                                .toLowerCase();
                return locationText.contains(scopeArea.toLowerCase());
        }

        private List<ReportsInventoryConflictItemResponse> buildConflictItems(BookItem item, String scopeArea) {
                List<ReportsInventoryConflictItemResponse> conflicts = new java.util.ArrayList<>();

                if (item.getStatus() == BookStatus.BORROWING || item.getStatus() == BookStatus.OVERDUE) {
                        item.setStatus(BookStatus.AVAILABLE);
                        bookItemRepository.save(item);
                        conflicts.add(new ReportsInventoryConflictItemResponse(
                                        item.getBarcode(),
                                        "BORROWED_ON_SHELF",
                                        "Sách đang ở trạng thái mượn nhưng được tìm thấy trên kệ. Đã tự động chuyển về AVAILABLE.",
                                        true));
                }

                if (!isInScope(item, scopeArea)) {
                        conflicts.add(new ReportsInventoryConflictItemResponse(
                                        item.getBarcode(),
                                        "LOCATION_MISMATCH",
                                        "Barcode được nhập nhưng đang nằm ngoài khu vực kiểm kê của phiên hiện tại.",
                                        false));
                }

                return conflicts;
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
    public List<ReportsTrendResponse> trends(String period) {
        String safePeriod = normalizePeriod(period);
        LocalDateTime now = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        
        return switch (safePeriod) {
            case PERIOD_YEAR -> generateYearlyTrends(now);
            case PERIOD_QUARTER -> generateQuarterlyTrends(now);
            default -> generateDailyTrends(now);
        };
    }

    private List<ReportsTrendResponse> generateDailyTrends(LocalDateTime now) {
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

    private List<ReportsTrendResponse> generateQuarterlyTrends(LocalDateTime now) {
        LocalDateTime quarterStart = now.minusMonths(3).withDayOfMonth(1).truncatedTo(ChronoUnit.DAYS);
        return java.util.stream.Stream.iterate(quarterStart, date -> date.plusMonths(1))
                .limit(3)
                .map(monthStart -> {
                    LocalDateTime monthEnd = monthStart.plusMonths(1);
                    long count = borrowRecordRepository.countByBorrowDateBetween(monthStart, monthEnd);
                    return new ReportsTrendResponse(monthStart, count);
                })
                .toList();
    }

    private List<ReportsTrendResponse> generateYearlyTrends(LocalDateTime now) {
        LocalDateTime yearStart = now.minusYears(1).withDayOfYear(1).truncatedTo(ChronoUnit.DAYS);
        return java.util.stream.Stream.iterate(yearStart, date -> date.plusMonths(1))
                .limit(12)
                .map(monthStart -> {
                    LocalDateTime monthEnd = monthStart.plusMonths(1);
                    long count = borrowRecordRepository.countByBorrowDateBetween(monthStart, monthEnd);
                    return new ReportsTrendResponse(monthStart, count);
                })
                .toList();
    }

    @Override
    public ReportsFinancialResponse financial(String period) {
        String safePeriod = period == null ? PERIOD_MONTH : period;
        LocalDateTime from = switch (safePeriod.toLowerCase()) {
            case PERIOD_YEAR -> LocalDateTime.now().minusYears(1);
            case PERIOD_QUARTER -> LocalDateTime.now().minusMonths(3);
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
                auditLogService.log(ACTOR_LIBRARIAN, "EXPORT_REPORT", "REPORT", format, "path=" + path);
                return new ReportsExportResponse("Xuất báo cáo thành công", format, path);
        }

        @Override
        public ReportsKpiResponse kpis(String period) {
                String safePeriod = normalizePeriod(period);
                LocalDateTime to = LocalDateTime.now();
                LocalDateTime from = resolveFromTime(safePeriod, to);

                long totalBorrows = borrowRecordRepository.countByBorrowDateBetween(from, to);

                long activeBorrows = bookItemRepository.countByStatusIn(ACTIVE_BORROW_STATUSES);
                long totalInventoryItems = bookItemRepository.countByStatusIn(ACTIVE_INVENTORY_STATUSES);
                double borrowingRate = totalInventoryItems == 0 ? 0.0 : (activeBorrows * 100.0 / totalInventoryItems);

                List<BorrowRecord> borrowRecordsInPeriod = borrowRecordRepository.findAll().stream()
                                .filter(borrowRecord -> borrowRecord.getBorrowDate() != null && !borrowRecord.getBorrowDate().isBefore(from) && !borrowRecord.getBorrowDate().isAfter(to))
                                .toList();

                Set<Long> borrowerIds = borrowRecordsInPeriod.stream()
                                .map(borrowRecord -> borrowRecord.getUser().getId())
                                .collect(Collectors.toSet());

                Set<Long> overdueUserIds = borrowRecordRepository.findByReturnDateIsNullAndStatusInAndDueDateBefore(ACTIVE_BORROW_STATUSES, to).stream()
                                .map(borrowRecord -> borrowRecord.getUser().getId())
                                .collect(Collectors.toSet());
                double overdueUserRate = borrowerIds.isEmpty() ? 0.0 : (overdueUserIds.size() * 100.0 / borrowerIds.size());

                double fineRevenue = finePaymentRepository.findByPaymentDateBetween(from, to).stream()
                                .mapToDouble(payment -> Objects.requireNonNullElse(payment.getAmount(), 0.0))
                                .sum();

                double membershipRevenue = membershipTransactionRepository.findByCreatedAtBetween(from, to).stream()
                                .filter(transaction -> Objects.requireNonNullElse(transaction.getAmount(), 0.0) > 0)
                                .mapToDouble(transaction -> Objects.requireNonNullElse(transaction.getAmount(), 0.0))
                                .sum();

                Map<Long, Long> borrowCountByBookId = borrowRecordsInPeriod.stream()
                                .collect(Collectors.groupingBy(
                                                borrowRecord -> borrowRecord.getBookItem().getBook().getId(),
                                                Collectors.counting()));

                Map<Long, String> titleByBookId = new ConcurrentHashMap<>();
                borrowRecordsInPeriod.forEach(borrowRecord -> titleByBookId.put(
                                borrowRecord.getBookItem().getBook().getId(),
                                borrowRecord.getBookItem().getBook().getTitle()));

                List<ReportsTopBookItemResponse> topBorrowed = borrowCountByBookId.entrySet().stream()
                                .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                                .limit(10)
                                .map(entry -> new ReportsTopBookItemResponse(
                                                entry.getKey(),
                                                titleByBookId.get(entry.getKey()),
                                                entry.getValue()))
                                .toList();

                LocalDateTime oneYearAgo = to.minusYears(1);
                Set<Long> borrowedWithinYearBookIds = borrowRecordRepository.findAll().stream()
                                .filter(borrowRecord -> borrowRecord.getBorrowDate() != null
                                                && !borrowRecord.getBorrowDate().isBefore(oneYearAgo))
                                .map(borrowRecord -> borrowRecord.getBookItem().getBook().getId())
                                .collect(Collectors.toSet());

                List<ReportsTopBookItemResponse> topUnborrowed = bookRepository.findByDiscardedFalse().stream()
                                .filter(book -> !borrowedWithinYearBookIds.contains(book.getId()))
                                .sorted(Comparator.comparing(Book::getTitle))
                                .limit(10)
                                .map(book -> new ReportsTopBookItemResponse(book.getId(), book.getTitle(), 0))
                                .toList();
                List<Book> activeBooks = bookRepository.findByDiscardedFalse();
                long totalBooks = activeBooks.size();
                Map<String, Long> categoryCount = activeBooks.stream()
                                .collect(Collectors.groupingBy(
                                                book -> book.getCategory() != null ? book.getCategory().getName() : "Khác",
                                                Collectors.counting()));

                List<ReportsCategoryShareResponse> categoryDistribution = categoryCount.entrySet().stream()
                                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                                .map(entry -> new ReportsCategoryShareResponse(
                                                entry.getKey(),
                                                totalBooks == 0 ? 0.0 : round2(entry.getValue() * 100.0 / totalBooks),
                                                entry.getValue()))
                                .toList();

                List<ReportsMonthlyUserGrowthResponse> newMembersByMonth = last12MonthsNewUsers();

                return new ReportsKpiResponse(
                                safePeriod,
                                totalBorrows,
                                round2(borrowingRate),
                                round2(overdueUserRate),
                                membershipRevenue,
                                fineRevenue,
                                topBorrowed,
                                topUnborrowed,
                                categoryDistribution,
                                newMembersByMonth);
        }

        @Override
        @Transactional
        public ReportsPhysicalAuditResponse runPhysicalAudit(ReportsPhysicalAuditRequest request) {
                String observed = request.observedState().trim().toUpperCase();
                BookItem item = bookItemRepository.findByBarcode(request.barcode().trim())
                                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sách theo barcode"));

                BookStatus systemStatus = item.getStatus();
                String result;
                String message;

                switch (observed) {
                        case "ON_SHELF" -> {
                                if (systemStatus == BookStatus.BORROWING || systemStatus == BookStatus.OVERDUE) {
                                        result = "DATA_ERROR";
                                        message = "Sách có trên kệ nhưng hệ thống đang ghi nhận là đang mượn.";
                                } else {
                                        result = "OK";
                                        message = "Trạng thái khớp với dữ liệu kho.";
                                }
                        }
                        case "MISSING" -> {
                                if (systemStatus == BookStatus.AVAILABLE || systemStatus == BookStatus.RESERVED) {
                                        item.setStatus(BookStatus.LOST);
                                        bookItemRepository.save(item);
                                        result = "LOST_MARKED";
                                        message = "Đã đánh dấu LOST do kiểm kê không tìm thấy sách trên kệ.";
                                } else {
                                        result = "NO_CHANGE";
                                        message = "Không thay đổi trạng thái vì sách không thuộc trạng thái có thể nằm trên kệ.";
                                }
                        }
                        case "DAMAGED" -> {
                                if (systemStatus == BookStatus.DISCARDED) {
                                        result = "NO_CHANGE";
                                        message = "Sách đã thanh lý, không cập nhật trạng thái hư hại.";
                                } else {
                                        item.setStatus(BookStatus.DAMAGED);
                                        bookItemRepository.save(item);
                                        result = "DAMAGED_MARKED";
                                        message = "Đã cập nhật trạng thái DAMAGED từ kết quả kiểm kê.";
                                }
                        }
                        default -> throw new IllegalArgumentException("observedState chỉ hỗ trợ ON_SHELF, MISSING, DAMAGED");
                }

                auditLogService.log(
                                ACTOR_LIBRARIAN,
                                "PHYSICAL_AUDIT",
                                TARGET_BOOK_ITEM,
                                item.getBarcode(),
                                "observed=" + observed + ", result=" + result + ", note=" + Objects.requireNonNullElse(request.note(), ""));

                return new ReportsPhysicalAuditResponse(item.getBarcode(), systemStatus.name(), observed, result, message);
        }

        @Override
        public ReportsDigitalAuditResponse runDigitalAudit() {
                List<Book> digitalBooks = bookRepository.findByIsDigitalTrue().stream()
                                .filter(book -> !book.isDiscarded())
                                .toList();

                List<ReportsDigitalAuditItemResponse> items = digitalBooks.stream()
                                .map(book -> checkDigitalAsset(book.getId(), book.getTitle(), book.getCoverImageUrl()))
                                .toList();

                int brokenCount = (int) items.stream().filter(item -> !item.healthy()).count();
                auditLogService.log("SYSTEM", "DIGITAL_AUDIT", "DIGITAL_COLLECTION", "ALL", "checked=" + items.size() + ", broken=" + brokenCount);
                return new ReportsDigitalAuditResponse(items.size(), brokenCount, items);
        }

        @Override
        @Transactional(readOnly = true)
        public ReportsDiscardSuggestionsResponse discardSuggestions() {
                List<BookItem> activeItems = bookItemRepository.findByStatusNot(BookStatus.DISCARDED).stream()
                                .filter(item -> item.getBook() != null)
                                .toList();

                List<ReportsDiscardCandidateResponse> candidates = activeItems.stream()
                                .map(this::toDiscardCandidate)
                                .filter(Objects::nonNull)
                                .toList();

                int damaged = (int) candidates.stream().filter(c -> CRITERIA_DAMAGED.equals(c.criteriaCode())).count();
                int lostOver365 = (int) candidates.stream().filter(c -> CRITERIA_LOST_OVER_365.equals(c.criteriaCode())).count();
                int staleNoBorrow = (int) candidates.stream().filter(c -> CRITERIA_STALE_NO_BORROW.equals(c.criteriaCode())).count();

                return new ReportsDiscardSuggestionsResponse(
                                candidates.size(),
                                damaged,
                                lostOver365,
                                staleNoBorrow,
                                candidates);
        }

        @Override
        @Transactional(readOnly = true)
        public List<ReportsDiscardReportSummaryResponse> discardReports() {
                return discardReportRepository.findAllByOrderByCreatedAtDesc().stream()
                                .map(report -> new ReportsDiscardReportSummaryResponse(
                                                report.getId(),
                                                report.getReportCode(),
                                                report.getReason(),
                                                report.getDiscardedCount(),
                                                report.getCreatedAt()))
                                .toList();
        }

        @Override
        @Transactional(readOnly = true)
        public ReportsDiscardReportDetailResponse discardReportDetail(Long reportId) {
                DiscardReport report = discardReportRepository.findById(reportId)
                                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy biên bản thanh lý"));

                List<ReportsDiscardReportItemResponse> items = discardReportItemRepository.findByReportIdOrderByIdAsc(reportId).stream()
                                .map(item -> new ReportsDiscardReportItemResponse(
                                                item.getBarcode(),
                                                item.getTitle(),
                                                item.getPreviousStatus(),
                                                BookStatus.DISCARDED.name(),
                                                item.getCriteriaCode()))
                                .toList();

                return new ReportsDiscardReportDetailResponse(
                                report.getId(),
                                report.getReportCode(),
                                report.getReason(),
                                report.getDiscardedCount(),
                                report.getCreatedAt(),
                                items);
        }

        @Override
        @Transactional
        public ReportsDiscardBooksResponse discardBooks(ReportsDiscardBooksRequest request) {
                List<String> barcodes = request.barcodes().stream()
                                .filter(Objects::nonNull)
                                .map(String::trim)
                                .filter(s -> !s.isBlank())
                                .distinct()
                                .toList();
                if (barcodes.isEmpty()) {
                        throw new IllegalArgumentException("barcodes không hợp lệ");
                }

                List<BookItem> items = bookItemRepository.findByBarcodeIn(barcodes);
                if (items.size() != barcodes.size()) {
                        throw new IllegalArgumentException("Một số barcode không tồn tại để thanh lý");
                }

                boolean hasActiveItems = items.stream().anyMatch(item -> NON_DISCARDABLE_STATUSES.contains(item.getStatus()));
                if (hasActiveItems) {
                        throw new IllegalArgumentException("Không thể thanh lý sách đang mượn/đặt trước");
                }

                boolean hasDiscardedItems = items.stream().anyMatch(item -> item.getStatus() == BookStatus.DISCARDED);
                if (hasDiscardedItems) {
                        throw new IllegalArgumentException("Danh sách chứa barcode đã ở trạng thái DISCARDED");
                }

                List<ReportsDiscardReportItemResponse> reportItems = items.stream()
                                .map(item -> {
                                        String previousStatus = item.getStatus() == null ? STATUS_UNKNOWN : item.getStatus().name();
                                        String criteria = detectCriteriaCode(item, borrowRecordRepository.countByBookItemId(item.getId()));
                                        return new ReportsDiscardReportItemResponse(
                                                        item.getBarcode(),
                                                        item.getBook() == null ? "N/A" : item.getBook().getTitle(),
                                                        previousStatus,
                                                        BookStatus.DISCARDED.name(),
                                                        criteria);
                                })
                                .toList();

                items.forEach(item -> item.setStatus(BookStatus.DISCARDED));
                bookItemRepository.saveAll(items);

                Map<Long, Long> remainingByBook = items.stream()
                                .map(item -> item.getBook() == null ? null : item.getBook().getId())
                                .filter(Objects::nonNull)
                                .distinct()
                                .collect(Collectors.toMap(
                                                bookId -> bookId,
                                                bookId -> bookItemRepository.countByBookIdAndStatusNot(bookId, BookStatus.DISCARDED),
                                                (left, right) -> left,
                                                LinkedHashMap::new));

                List<Book> touchedBooks = bookRepository.findAllById(remainingByBook.keySet());
                touchedBooks.forEach(book -> book.setDiscarded(remainingByBook.getOrDefault(book.getId(), 0L) == 0L));
                bookRepository.saveAll(touchedBooks);

                DiscardReport report = new DiscardReport();
                report.setReportCode(buildReportCode());
                report.setReason(Objects.requireNonNullElse(request.reason(), "N/A"));
                report.setDiscardedCount(items.size());
                DiscardReport savedReport = discardReportRepository.save(report);

                List<DiscardReportItem> reportEntities = reportItems.stream()
                                .map(item -> {
                                        DiscardReportItem entity = new DiscardReportItem();
                                        entity.setReport(savedReport);
                                        entity.setBarcode(item.barcode());
                                        entity.setTitle(item.title());
                                        entity.setPreviousStatus(item.previousStatus());
                                        entity.setCriteriaCode(item.criteriaCode());
                                        return entity;
                                })
                                .toList();
                discardReportItemRepository.saveAll(reportEntities);

                auditLogService.log(
                                ACTOR_LIBRARIAN,
                                "DISCARD_BOOKS",
                                TARGET_BOOK_ITEM,
                                barcodes.toString(),
                                "reason=" + Objects.requireNonNullElse(request.reason(), "N/A") + ", reportCode=" + savedReport.getReportCode());

                return new ReportsDiscardBooksResponse(
                                "Thanh lý mềm thành công. Đã tạo biên bản thanh lý.",
                                barcodes,
                                barcodes.size(),
                                savedReport.getId(),
                                savedReport.getReportCode(),
                                savedReport.getCreatedAt(),
                                reportItems);
        }

        @Override
        public List<ReportsAuditLogResponse> auditLogs() {
                return auditLogService.latest().stream()
                                .map(log -> new ReportsAuditLogResponse(
                                                log.getId(),
                                                log.getActor(),
                                                log.getAction(),
                                                log.getTargetType(),
                                                log.getTargetId(),
                                                log.getDetails(),
                                                log.getCreatedAt()))
                                .toList();
    }

        private ReportsDigitalAuditItemResponse checkDigitalAsset(Long bookId, String title, String fileUrl) {
                if (fileUrl == null || fileUrl.isBlank()) {
                        return new ReportsDigitalAuditItemResponse(bookId, title, fileUrl, false, "Thiếu link file");
                }

                try {
                        URI uri = URI.create(fileUrl.trim());
                        if (!"http".equalsIgnoreCase(uri.getScheme()) && !"https".equalsIgnoreCase(uri.getScheme())) {
                                return new ReportsDigitalAuditItemResponse(bookId, title, fileUrl, false, "Link không dùng http/https");
                        }

                        HttpRequest request = HttpRequest.newBuilder(uri)
                                        .timeout(java.time.Duration.ofSeconds(4))
                                        .method("HEAD", HttpRequest.BodyPublishers.noBody())
                                        .build();

                        HttpResponse<Void> response = HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.discarding());
                        boolean healthy = response.statusCode() >= 200 && response.statusCode() < 400;
                        String detail = healthy ? "OK" : ("HTTP " + response.statusCode());
                        return new ReportsDigitalAuditItemResponse(bookId, title, fileUrl, healthy, detail);
                } catch (InterruptedException ex) {
                        Thread.currentThread().interrupt();
                        return new ReportsDigitalAuditItemResponse(bookId, title, fileUrl, false, "InterruptedException");
                } catch (Exception ex) {
                        return new ReportsDigitalAuditItemResponse(bookId, title, fileUrl, false, ex.getClass().getSimpleName());
                }
        }

        private List<ReportsMonthlyUserGrowthResponse> last12MonthsNewUsers() {
                LocalDate start = LocalDate.now().withDayOfMonth(1).minusMonths(11);
                LocalDateTime from = start.atStartOfDay();
                LocalDateTime to = LocalDateTime.now();

                Map<String, Long> monthly = userRepository.findByCreatedAtBetween(from, to).stream()
                                .collect(Collectors.groupingBy(
                                                user -> user.getCreatedAt().toLocalDate().withDayOfMonth(1).toString().substring(0, 7),
                                                Collectors.counting()));

                return java.util.stream.Stream.iterate(start, month -> month.plusMonths(1))
                                .limit(12)
                                .map(month -> {
                                        String key = month.toString().substring(0, 7);
                                        return new ReportsMonthlyUserGrowthResponse(key, monthly.getOrDefault(key, 0L));
                                })
                                .toList();
        }

        private LocalDateTime resolveFromTime(String period, LocalDateTime now) {
                return switch (period) {
                        case PERIOD_YEAR -> now.minusYears(1);
                        case PERIOD_QUARTER -> now.minusMonths(3);
                        default -> now.minusMonths(1);
                };
        }

        private String normalizePeriod(String period) {
                if (period == null) {
                        return PERIOD_MONTH;
                }
                String safe = period.toLowerCase();
                if (!Set.of(PERIOD_MONTH, PERIOD_QUARTER, PERIOD_YEAR).contains(safe)) {
                        return PERIOD_MONTH;
                }
                return safe;
        }

        private double round2(double value) {
                return Math.round(value * 100.0) / 100.0;
        }

        private ReportsDiscardCandidateResponse toDiscardCandidate(BookItem item) {
                long borrowCount = borrowRecordRepository.countByBookItemId(item.getId());
                String criteriaCode = detectCriteriaCode(item, borrowCount);
                if (CRITERIA_MANUAL.equals(criteriaCode)) {
                        return null;
                }

                Long lostDays = null;
                if (item.getStatus() == BookStatus.LOST) {
                        lostDays = borrowRecordRepository.findFirstByBookItemIdOrderByBorrowDateDesc(item.getId())
                                        .map(BorrowRecord::getBorrowDate)
                                        .map(date -> date.until(LocalDateTime.now(), ChronoUnit.DAYS))
                                        .orElse(null);
                }

                return new ReportsDiscardCandidateResponse(
                                item.getBarcode(),
                                item.getBook() == null ? "N/A" : item.getBook().getTitle(),
                                item.getStatus() == null ? STATUS_UNKNOWN : item.getStatus().name(),
                                criteriaCode,
                                criteriaLabel(criteriaCode),
                                buildLocationLabel(item),
                                item.getBook() == null ? null : item.getBook().getPublishYear(),
                                borrowCount,
                                lostDays);
        }

        private String detectCriteriaCode(BookItem item, long borrowCount) {
                if (NON_DISCARDABLE_STATUSES.contains(item.getStatus())) {
                        return CRITERIA_MANUAL;
                }

                if (item.getStatus() == BookStatus.DAMAGED) {
                        return CRITERIA_DAMAGED;
                }

                if (item.getStatus() == BookStatus.LOST
                                && borrowRecordRepository.findFirstByBookItemIdOrderByBorrowDateDesc(item.getId())
                                                .map(BorrowRecord::getBorrowDate)
                                                .map(date -> date.until(LocalDateTime.now(), ChronoUnit.DAYS) > 365)
                                                .orElse(false)) {
                        return CRITERIA_LOST_OVER_365;
                }

                Integer publishYear = item.getBook() == null ? null : item.getBook().getPublishYear();
                if (item.getStatus() == BookStatus.AVAILABLE
                                && publishYear != null
                                && publishYear <= LocalDate.now().getYear() - 5
                                && borrowCount == 0) {
                        return CRITERIA_STALE_NO_BORROW;
                }

                return CRITERIA_MANUAL;
        }

        private String criteriaLabel(String code) {
                return switch (code) {
                        case CRITERIA_DAMAGED -> "Hư hại nặng (DAMAGED)";
                        case CRITERIA_LOST_OVER_365 -> "Mất quá 365 ngày (LOST)";
                        case CRITERIA_STALE_NO_BORROW -> "Tồn kho >= 5 năm, chưa từng mượn";
                        default -> "Duyệt thủ công";
                };
        }

        private String buildReportCode() {
                return "BBTL-" + LocalDate.now().toString().replace("-", "") + "-" + System.currentTimeMillis();
        }

}
