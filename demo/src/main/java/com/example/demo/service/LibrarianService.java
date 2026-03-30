package com.example.demo.service;

import java.util.List;

import com.example.demo.dto.librarian.LibrarianApproveRenewResponse;
import com.example.demo.dto.librarian.LibrarianBookRequest;
import com.example.demo.dto.librarian.LibrarianBookResponse;
import com.example.demo.dto.librarian.LibrarianCheckinRequest;
import com.example.demo.dto.librarian.LibrarianCheckinResponse;
import com.example.demo.dto.librarian.LibrarianCheckoutRequest;
import com.example.demo.dto.librarian.LibrarianCheckoutResponse;
import com.example.demo.dto.librarian.LibrarianDashboardResponse;
import com.example.demo.dto.librarian.LibrarianDebtorResponse;
import com.example.demo.dto.librarian.LibrarianDeleteBookResponse;
import com.example.demo.dto.librarian.LibrarianIncidentRequest;
import com.example.demo.dto.librarian.LibrarianIncidentResponse;
import com.example.demo.dto.librarian.LibrarianLocationRequest;
import com.example.demo.dto.librarian.LibrarianLocationResponse;
import com.example.demo.dto.librarian.LibrarianRejectRenewResponse;
import com.example.demo.dto.librarian.LibrarianRenewalRequestResponse;

public interface LibrarianService {
    LibrarianDashboardResponse dashboard();

    List<LibrarianBookResponse> listBooks();

    LibrarianBookResponse createBook(LibrarianBookRequest request);

    LibrarianBookResponse updateBook(Long id, LibrarianBookRequest request);

    LibrarianDeleteBookResponse deleteBook(Long id);

    LibrarianCheckoutResponse checkout(LibrarianCheckoutRequest request);

    LibrarianCheckinResponse checkin(LibrarianCheckinRequest request);

    List<LibrarianLocationResponse> locations();

    LibrarianLocationResponse createLocation(LibrarianLocationRequest request);

    List<LibrarianRenewalRequestResponse> renewalRequests();

    LibrarianApproveRenewResponse approveRenew(Long recordId);

    LibrarianRejectRenewResponse rejectRenew(Long recordId);

    List<LibrarianDebtorResponse> debtors();

    List<LibrarianIncidentResponse> incidents();

    LibrarianIncidentResponse createIncident(LibrarianIncidentRequest request);
}
