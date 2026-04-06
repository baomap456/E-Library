package com.example.demo;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.demo.dto.borrowing.ApproveBorrowRequestDto;
import com.example.demo.dto.borrowing.BorrowRequestResponse;
import com.example.demo.mapper.BorrowingMapper;
import com.example.demo.model.Book;
import com.example.demo.model.BookItem;
import com.example.demo.model.BookStatus;
import com.example.demo.model.BorrowRequest;
import com.example.demo.model.BorrowRequestStatus;
import com.example.demo.model.BorrowRequestType;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.BookItemRepository;
import com.example.demo.repository.BorrowRecordRepository;
import com.example.demo.repository.BorrowRequestRepository;
import com.example.demo.repository.ReservationRepository;
import com.example.demo.service.DebtRestrictionService;
import com.example.demo.service.NotificationDispatchService;
import com.example.demo.service.RenewalPolicyService;
import com.example.demo.service.UserContextService;
import com.example.demo.service.impl.BorrowRequestServiceImpl;

@ExtendWith(MockitoExtension.class)
class BorrowRequestServiceImplTest {

    @Mock
    private BorrowRequestRepository borrowRequestRepository;

    @Mock
    private BorrowRecordRepository borrowRecordRepository;

    @Mock
    private BookItemRepository bookItemRepository;

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private NotificationDispatchService notificationDispatchService;

    @Mock
    private UserContextService userContextService;

    @Mock
    private BorrowingMapper borrowingMapper;

    @Mock
    private DebtRestrictionService debtRestrictionService;

    @Mock
    private RenewalPolicyService renewalPolicyService;

    @InjectMocks
    private BorrowRequestServiceImpl borrowRequestService;

    @Test
    void reject_request_should_release_reserved_book_item() {
        User librarian = librarianUser();
        BookItem reservedItem = reservedBookItem(10L, 100L);
        BorrowRequest request = pendingRequest(99L, memberUser(2L), reservedItem);

        when(userContextService.getCurrentUser()).thenReturn(librarian);
        when(borrowRequestRepository.findById(99L)).thenReturn(Optional.of(request));
        when(borrowRequestRepository.save(any(BorrowRequest.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));
        when(bookItemRepository.save(any(BookItem.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));
        when(borrowingMapper.toBorrowRequestResponse(any(BorrowRequest.class)))
            .thenReturn(new BorrowRequestResponse(
                1L,
                1L,
                null,
                "reader01",
                "Reader",
                1L,
                1L,
                "Refactoring",
                "9780134757599",
                null,
                null,
                null,
                null,
                null,
                null,
                BorrowRequestStatus.REJECTED,
                BorrowRequestType.BORROW,
                "REQUEST"));

        borrowRequestService.processBorrowRequest(new ApproveBorrowRequestDto(99L, false, "Từ chối"));

        assertThat(request.getStatus()).isEqualTo(BorrowRequestStatus.REJECTED);
        assertThat(request.getBookItem().getStatus()).isEqualTo(BookStatus.AVAILABLE);
        assertThat(request.getApprovedBy()).isEqualTo(librarian);
        verify(bookItemRepository).save(request.getBookItem());
    }

    @Test
    void cancel_request_by_user_should_release_reserved_book_item() {
        User borrower = memberUser(5L);
        BookItem reservedItem = reservedBookItem(11L, 101L);
        BorrowRequest request = pendingRequest(100L, borrower, reservedItem);

        when(userContextService.getCurrentUser()).thenReturn(borrower);
        when(borrowRequestRepository.findById(100L)).thenReturn(Optional.of(request));
        when(borrowRequestRepository.save(any(BorrowRequest.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));
        when(bookItemRepository.save(any(BookItem.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));
        when(borrowingMapper.toBorrowRequestResponse(any(BorrowRequest.class)))
            .thenReturn(new BorrowRequestResponse(
                1L,
                1L,
                null,
                "reader01",
                "Reader",
                1L,
                1L,
                "Refactoring",
                "9780134757599",
                null,
                null,
                null,
                null,
                null,
                null,
                BorrowRequestStatus.CANCELLED,
                BorrowRequestType.BORROW,
                "REQUEST"));

        borrowRequestService.cancelRequest(100L);

        assertThat(request.getStatus()).isEqualTo(BorrowRequestStatus.CANCELLED);
        assertThat(request.getBookItem().getStatus()).isEqualTo(BookStatus.AVAILABLE);
        verify(bookItemRepository).save(request.getBookItem());
    }

    @Test
    void auto_cancel_expired_pickup_requests_should_release_reserved_book_item() {
        User borrower = memberUser(7L);
        BookItem reservedItem = reservedBookItem(12L, 102L);
        BorrowRequest expired = pendingRequest(101L, borrower, reservedItem);
        expired.setRequestedPickupDate(LocalDate.now().minusDays(1));

        when(borrowRequestRepository.findByStatusAndRequestedPickupDateBefore(
                BorrowRequestStatus.PENDING,
                LocalDate.now())).thenReturn(List.of(expired));
        when(borrowRequestRepository.save(any(BorrowRequest.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));
        when(bookItemRepository.save(any(BookItem.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));
        when(notificationDispatchService.createAndDispatch(any(User.class), anyString(), anyString(), anyMap()))
                .thenReturn(null);

        borrowRequestService.autoCancelExpiredPickupRequests();

        assertThat(expired.getStatus()).isEqualTo(BorrowRequestStatus.CANCELLED);
        assertThat(expired.getBookItem().getStatus()).isEqualTo(BookStatus.AVAILABLE);
        verify(bookItemRepository).save(expired.getBookItem());
        verify(notificationDispatchService).createAndDispatch(
                any(User.class),
                anyString(),
                anyString(),
                anyMap());
    }

    @Test
    void approve_request_should_set_book_item_to_borrowing_when_item_is_reserved() {
        User librarian = librarianUser();
        User borrower = memberUser(9L);
        BookItem reservedItem = reservedBookItem(13L, 103L);
        BorrowRequest request = pendingRequest(102L, borrower, reservedItem);

        when(userContextService.getCurrentUser()).thenReturn(librarian);
        when(borrowRequestRepository.findById(102L)).thenReturn(Optional.of(request));
        when(borrowRecordRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(bookItemRepository.save(any(BookItem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(borrowRequestRepository.save(any(BorrowRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(borrowingMapper.toBorrowRequestResponse(any(BorrowRequest.class)))
            .thenReturn(new BorrowRequestResponse(
                102L,
                borrower.getId(),
                null,
                "reader01",
                "Reader",
                103L,
                13L,
                "Refactoring",
                "9780134757599",
                null,
                null,
                null,
                null,
                "Được duyệt",
                "librarian01",
                BorrowRequestStatus.APPROVED,
                BorrowRequestType.BORROW,
                "REQUEST"));

        borrowRequestService.processBorrowRequest(new ApproveBorrowRequestDto(102L, true, "Duyệt phiếu"));

        assertThat(request.getStatus()).isEqualTo(BorrowRequestStatus.APPROVED);
        assertThat(request.getBookItem().getStatus()).isEqualTo(BookStatus.BORROWING);
        assertThat(request.getApprovedBy()).isEqualTo(librarian);
        verify(borrowRecordRepository).save(any());
        verify(bookItemRepository).save(request.getBookItem());
    }

    @Test
    void approve_request_should_set_book_item_to_borrowing_when_item_is_available() {
        User librarian = librarianUser();
        User borrower = memberUser(10L);
        BookItem availableItem = availableBookItem(14L, 104L);
        BorrowRequest request = pendingRequest(103L, borrower, availableItem);

        when(userContextService.getCurrentUser()).thenReturn(librarian);
        when(borrowRequestRepository.findById(103L)).thenReturn(Optional.of(request));
        when(borrowRecordRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(bookItemRepository.save(any(BookItem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(borrowRequestRepository.save(any(BorrowRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(borrowingMapper.toBorrowRequestResponse(any(BorrowRequest.class)))
            .thenReturn(new BorrowRequestResponse(
                103L,
                borrower.getId(),
                null,
                "reader02",
                "Reader Two",
                104L,
                14L,
                "Clean Code",
                "9780132350884",
                null,
                null,
                null,
                null,
                "Được duyệt",
                "librarian01",
                BorrowRequestStatus.APPROVED,
                BorrowRequestType.BORROW,
                "REQUEST"));

        borrowRequestService.processBorrowRequest(new ApproveBorrowRequestDto(103L, true, "Duyệt phiếu"));

        assertThat(request.getStatus()).isEqualTo(BorrowRequestStatus.APPROVED);
        assertThat(request.getBookItem().getStatus()).isEqualTo(BookStatus.BORROWING);
        assertThat(request.getApprovedBy()).isEqualTo(librarian);
        verify(borrowRecordRepository).save(any());
        verify(bookItemRepository).save(request.getBookItem());
    }

    private BorrowRequest pendingRequest(Long requestId, User user, BookItem bookItem) {
        BorrowRequest request = new BorrowRequest();
        request.setId(requestId);
        request.setUser(user);
        request.setBookItem(bookItem);
        request.setStatus(BorrowRequestStatus.PENDING);
        request.setRequestType(BorrowRequestType.BORROW);
        return request;
    }

    private BookItem reservedBookItem(Long itemId, Long bookId) {
        Book book = new Book();
        book.setId(bookId);

        BookItem item = new BookItem();
        item.setId(itemId);
        item.setBook(book);
        item.setStatus(BookStatus.RESERVED);
        return item;
    }

    private BookItem availableBookItem(Long itemId, Long bookId) {
        Book book = new Book();
        book.setId(bookId);

        BookItem item = new BookItem();
        item.setId(itemId);
        item.setBook(book);
        item.setStatus(BookStatus.AVAILABLE);
        return item;
    }

    private User librarianUser() {
        User user = new User();
        user.setId(1L);

        Role librarianRole = new Role();
        librarianRole.setName("ROLE_LIBRARIAN");
        user.setRoles(Set.of(librarianRole));
        return user;
    }

    private User memberUser(Long id) {
        User user = new User();
        user.setId(id);

        Role memberRole = new Role();
        memberRole.setName("ROLE_MEMBER");
        user.setRoles(Set.of(memberRole));
        return user;
    }
}
