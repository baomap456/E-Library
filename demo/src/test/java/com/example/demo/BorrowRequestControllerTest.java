package com.example.demo;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.example.demo.controller.BorrowRequestController;
import com.example.demo.dto.borrowing.BorrowRequestResponse;
import com.example.demo.model.BorrowRequestStatus;
import com.example.demo.service.BorrowRequestService;

@ExtendWith(MockitoExtension.class)
class BorrowRequestControllerTest {

    private MockMvc mockMvc;

    @Mock
    private BorrowRequestService borrowRequestService;

    @InjectMocks
    private BorrowRequestController borrowRequestController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(borrowRequestController).build();
    }

    @Test
    void approve_endpoint_should_return_200_and_delegate_to_service() throws Exception {
        BorrowRequestResponse response = sampleResponse(BorrowRequestStatus.APPROVED);
        when(borrowRequestService.processBorrowRequest(any())).thenReturn(response);

        String body = """
            {
              "requestId": 101,
              "approve": true,
              "note": "Duyệt"
            }
            """;

        mockMvc.perform(post("/api/borrow-requests/approve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isOk());

        verify(borrowRequestService).processBorrowRequest(any());
    }

    @Test
    void cancel_endpoint_should_return_200_and_delegate_to_service() throws Exception {
        BorrowRequestResponse response = sampleResponse(BorrowRequestStatus.CANCELLED);
        when(borrowRequestService.cancelRequest(101L)).thenReturn(response);

        mockMvc.perform(delete("/api/borrow-requests/{requestId}", 101L))
            .andExpect(status().isOk());

        verify(borrowRequestService).cancelRequest(eq(101L));
    }

    @Test
    void create_endpoint_should_return_200_and_delegate_to_service() throws Exception {
        BorrowRequestResponse response = sampleResponse(BorrowRequestStatus.PENDING);
        when(borrowRequestService.createBorrowRequest(any())).thenReturn(response);

                String body = """
                        {
                            "username": "reader01",
                            "bookId": 10,
                            "requestedPickupDate": "2030-01-02",
                            "requestedReturnDate": "2030-01-08"
                        }
                        """;

        mockMvc.perform(post("/api/borrow-requests/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isOk());

        verify(borrowRequestService).createBorrowRequest(any());
    }

    private BorrowRequestResponse sampleResponse(BorrowRequestStatus status) {
        return new BorrowRequestResponse(
            101L,
            1L,
            "reader01",
            "Reader",
            10L,
            20L,
            "Refactoring",
            "9780134757599",
            LocalDateTime.now(),
            LocalDate.now().plusDays(1),
            LocalDate.now().plusDays(7),
            null,
            null,
            null,
            status);
    }
}
