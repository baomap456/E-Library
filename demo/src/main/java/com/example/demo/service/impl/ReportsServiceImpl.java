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
import com.example.demo.dto.reports.ReportsDiscrepancyResponse;
import com.example.demo.dto.reports.ReportsExportRequest;
import com.example.demo.dto.reports.ReportsExportResponse;
import com.example.demo.dto.reports.ReportsFinancialResponse;
import com.example.demo.dto.reports.ReportsInventorySessionRequest;
import com.example.demo.dto.reports.ReportsInventorySessionResponse;
import com.example.demo.dto.reports.ReportsKpiResponse;
import com.example.demo.dto.reports.ReportsMonthlyUserGrowthResponse;
import com.example.demo.dto.reports.ReportsPhysicalAuditRequest;
import com.example.demo.dto.reports.ReportsPhysicalAuditResponse;
import com.example.demo.dto.reports.ReportsTopBookItemResponse;
import com.example.demo.dto.reports.ReportsReconcileRequest;
import com.example.demo.dto.reports.ReportsReconcileResponse;
import com.example.demo.dto.reports.ReportsTrendResponse;
import com.example.demo.mapper.ReportsMapper;
import com.example.demo.model.Book;
import com.example.demo.model.BookItem;
import com.example.demo.model.BookStatus;
import com.example.demo.model.BorrowRecord;
import com.example.demo.repository.BookItemRepository;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.BorrowRecordRepository;
import com.example.demo.repository.FinePaymentRepository;
import com.example.demo.repository.MembershipTransactionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuditLogService;
import com.example.demo.service.ModuleStateService;
import com.example.demo.service.ReportsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportsServiceImpl implements ReportsService {

        private static final String PERIOD_MONTH = "month";
    private static final String PERIOD_QUARTER = "quarter";
    private static final String PERIOD_YEAR = "year";
    private static final String ACTOR_LIBRARIAN = "LIBRARIAN";

    private static final Set<BookStatus> ACTIVE_BORROW_STATUSES = Set.of(BookStatus.BORROWING, BookStatus.OVERDUE);
        private static final Set<BookStatus> ACTIVE_INVENTORY_STATUSES = Set.of(
                        BookStatus.AVAILABLE,
                        BookStatus.RESERVED,
                        BookStatus.BORROWING,
                        BookStatus.OVERDUE,
                        BookStatus.LOST,
                        BookStatus.DAMAGED);
        private static final Set<BookStatus> NON_DISCARDABLE_STATUSES = Set.of(BookStatus.BORROWING, BookStatus.OVERDUE, BookStatus.RESERVED);

        private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
                        .connectTimeout(java.time.Duration.ofSeconds(4))
                        .build();

    private final ModuleStateService moduleStateService;
    private final BookItemRepository bookItemRepository;
        private final BookRepository bookRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final FinePaymentRepository finePaymentRepository;
        private final MembershipTransactionRepository membershipTransactionRepository;
        private final UserRepository userRepository;
        private final AuditLogService auditLogService;
        private final ReportsMapper reportsMapper;

    @Override
    public ReportsInventorySessionResponse createInventorySession(ReportsInventorySessionRequest request) {
        String name = request != null && request.name() != null ? request.name() : "Inventory Session";
        String area = request != null && request.area() != null ? request.area() : "Main Warehouse";
                ReportsInventorySessionResponse response = reportsMapper.toInventorySessionResponse(moduleStateService.addInventorySession(name, area));
                auditLogService.log(ACTOR_LIBRARIAN, "CREATE_INVENTORY_SESSION", "INVENTORY_SESSION", String.valueOf(response.id()), "name=" + name + ", area=" + area);
                return response;
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

        ReportsReconcileResponse result = new ReportsReconcileResponse(
                String.valueOf(response.get("message")),
                request.sessionId(),
                request.barcode(),
                request.actualQuantity());
        auditLogService.log(ACTOR_LIBRARIAN, "RECONCILE_INVENTORY", "BOOK_ITEM", request.barcode(), "actualQuantity=" + request.actualQuantity());
        return result;
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
                                "BOOK_ITEM",
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
        @Transactional
        public ReportsDiscardBooksResponse discardBooks(ReportsDiscardBooksRequest request) {
                List<Long> bookIds = request.bookIds().stream().filter(Objects::nonNull).distinct().toList();
                if (bookIds.isEmpty()) {
                        throw new IllegalArgumentException("bookIds không hợp lệ");
                }

                List<Book> books = bookRepository.findAllById(bookIds);
                if (books.size() != bookIds.size()) {
                        throw new IllegalArgumentException("Một số sách không tồn tại để thanh lý");
                }

                List<BookItem> items = bookItemRepository.findByBookIdIn(bookIds);
                boolean hasActiveItems = items.stream().anyMatch(item -> NON_DISCARDABLE_STATUSES.contains(item.getStatus()));
                if (hasActiveItems) {
                        throw new IllegalArgumentException("Không thể thanh lý sách đang mượn/đặt trước");
                }

                books.forEach(book -> book.setDiscarded(true));
                bookRepository.saveAll(books);
                bookItemRepository.bulkUpdateStatusByBookIds(bookIds, BookStatus.DISCARDED);

                auditLogService.log(
                                ACTOR_LIBRARIAN,
                                "DISCARD_BOOKS",
                                "BOOK",
                                bookIds.toString(),
                                "reason=" + Objects.requireNonNullElse(request.reason(), "N/A"));

                return new ReportsDiscardBooksResponse(
                                "Thanh lý sách thành công. Dữ liệu lịch sử vẫn được giữ lại.",
                                bookIds,
                                bookIds.size());
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

}
