package com.example.demo.service;

import java.util.List;

import com.example.demo.dto.librarian.LibrarianApproveRenewResponse;
import com.example.demo.dto.librarian.LibrarianAuthorRequest;
import com.example.demo.dto.librarian.LibrarianAuthorResponse;
import com.example.demo.dto.librarian.LibrarianBookRequest;
import com.example.demo.dto.librarian.LibrarianBookResponse;
import com.example.demo.dto.librarian.LibrarianBorrowerOptionResponse;
import com.example.demo.dto.librarian.LibrarianCategoryRequest;
import com.example.demo.dto.librarian.LibrarianCategoryResponse;
import com.example.demo.dto.librarian.LibrarianCheckinRequest;
import com.example.demo.dto.librarian.LibrarianCheckinResponse;
import com.example.demo.dto.librarian.LibrarianCheckoutRequest;
import com.example.demo.dto.librarian.LibrarianCheckoutResponse;
import com.example.demo.dto.librarian.LibrarianCreateUserRequest;
import com.example.demo.dto.librarian.LibrarianCreateUserResponse;
import com.example.demo.dto.librarian.LibrarianDashboardResponse;
import com.example.demo.dto.librarian.LibrarianDebtorResponse;
import com.example.demo.dto.librarian.LibrarianDeleteBookResponse;
import com.example.demo.dto.librarian.LibrarianDigitalDocumentRequest;
import com.example.demo.dto.librarian.LibrarianDigitalDocumentResponse;
import com.example.demo.dto.librarian.LibrarianFineInvoiceResponse;
import com.example.demo.dto.librarian.LibrarianGuestCheckoutRequest;
import com.example.demo.dto.librarian.LibrarianIncidentRequest;
import com.example.demo.dto.librarian.LibrarianIncidentResponse;
import com.example.demo.dto.librarian.LibrarianLocationRequest;
import com.example.demo.dto.librarian.LibrarianLocationResponse;
import com.example.demo.dto.librarian.LibrarianMembershipInvoiceResponse;
import com.example.demo.dto.librarian.LibrarianRejectRenewResponse;
import com.example.demo.dto.librarian.LibrarianRenewalRequestResponse;
import com.example.demo.dto.librarian.LibrarianReportIncidentRequest;
import com.example.demo.dto.librarian.LibrarianReportIncidentResponse;
import com.example.demo.dto.librarian.LibrarianUpgradeAccountRequest;
import com.example.demo.dto.librarian.LibrarianUpgradeAccountResponse;
import com.example.demo.dto.librarian.LibrarianUserFineSummaryResponse;

public interface LibrarianService {
    LibrarianDashboardResponse dashboard();

    List<LibrarianBookResponse> listBooks();

    List<LibrarianDigitalDocumentResponse> listDigitalDocuments();

    LibrarianDigitalDocumentResponse createDigitalDocument(LibrarianDigitalDocumentRequest request);

    LibrarianDigitalDocumentResponse updateDigitalDocument(Long id, LibrarianDigitalDocumentRequest request);

    void deleteDigitalDocument(Long id);

    LibrarianBookResponse createBook(LibrarianBookRequest request);

    LibrarianBookResponse updateBook(Long id, LibrarianBookRequest request);

    LibrarianDeleteBookResponse deleteBook(Long id);

    LibrarianCheckoutResponse checkout(LibrarianCheckoutRequest request);

    LibrarianCheckoutResponse guestCheckout(LibrarianGuestCheckoutRequest request);

    List<LibrarianBorrowerOptionResponse> borrowers(String keyword);

    LibrarianCreateUserResponse createUser(LibrarianCreateUserRequest request);

    LibrarianUpgradeAccountResponse upgradeAccount(LibrarianUpgradeAccountRequest request);

    LibrarianCheckinResponse checkin(LibrarianCheckinRequest request);

    List<LibrarianLocationResponse> locations();

    LibrarianLocationResponse createLocation(LibrarianLocationRequest request);

    LibrarianLocationResponse updateLocation(Integer id, LibrarianLocationRequest request);

    void deleteLocation(Integer id);

    List<LibrarianAuthorResponse> authors();

    LibrarianAuthorResponse createAuthor(LibrarianAuthorRequest request);

    LibrarianAuthorResponse updateAuthor(Integer id, LibrarianAuthorRequest request);

    void deleteAuthor(Integer id);

    List<LibrarianCategoryResponse> categories();

    LibrarianCategoryResponse createCategory(LibrarianCategoryRequest request);

    LibrarianCategoryResponse updateCategory(Integer id, LibrarianCategoryRequest request);

    void deleteCategory(Integer id);

    List<LibrarianRenewalRequestResponse> renewalRequests();

    LibrarianApproveRenewResponse approveRenew(Long recordId);

    LibrarianRejectRenewResponse rejectRenew(Long recordId);

    List<LibrarianDebtorResponse> debtors();

    List<LibrarianFineInvoiceResponse> fineInvoices();

    List<LibrarianMembershipInvoiceResponse> membershipInvoices();

    List<LibrarianUserFineSummaryResponse> userFineSummaries();

    List<LibrarianIncidentResponse> incidents();

    LibrarianIncidentResponse createIncident(LibrarianIncidentRequest request);

    LibrarianReportIncidentResponse reportBorrowIncident(LibrarianReportIncidentRequest request);
}
