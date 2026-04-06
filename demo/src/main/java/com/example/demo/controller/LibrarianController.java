package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
import com.example.demo.service.LibrarianService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/librarian")
@RequiredArgsConstructor
public class LibrarianController {

    private final LibrarianService librarianService;

    @GetMapping("/dashboard")
    public ResponseEntity<LibrarianDashboardResponse> dashboard() {
        return ResponseEntity.ok(librarianService.dashboard());
    }

    @GetMapping("/books")
    public ResponseEntity<List<LibrarianBookResponse>> listBooks() {
        return ResponseEntity.ok(librarianService.listBooks());
    }

    @GetMapping("/digital-documents")
    public ResponseEntity<List<LibrarianDigitalDocumentResponse>> listDigitalDocuments() {
        return ResponseEntity.ok(librarianService.listDigitalDocuments());
    }

    @PostMapping("/digital-documents")
    public ResponseEntity<LibrarianDigitalDocumentResponse> createDigitalDocument(@Valid @RequestBody LibrarianDigitalDocumentRequest request) {
        return ResponseEntity.ok(librarianService.createDigitalDocument(request));
    }

    @PutMapping("/digital-documents/{id}")
    public ResponseEntity<LibrarianDigitalDocumentResponse> updateDigitalDocument(
            @PathVariable Long id,
            @Valid @RequestBody LibrarianDigitalDocumentRequest request) {
        return ResponseEntity.ok(librarianService.updateDigitalDocument(id, request));
    }

    @DeleteMapping("/digital-documents/{id}")
    public ResponseEntity<Void> deleteDigitalDocument(@PathVariable Long id) {
        librarianService.deleteDigitalDocument(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/books")
    public ResponseEntity<LibrarianBookResponse> createBook(@Valid @RequestBody LibrarianBookRequest request) {
        return ResponseEntity.ok(librarianService.createBook(request));
    }

    @PutMapping("/books/{id}")
    public ResponseEntity<LibrarianBookResponse> updateBook(@PathVariable Long id, @Valid @RequestBody LibrarianBookRequest request) {
        return ResponseEntity.ok(librarianService.updateBook(id, request));
    }

    @DeleteMapping("/books/{id}")
    public ResponseEntity<LibrarianDeleteBookResponse> deleteBook(@PathVariable Long id) {
        return ResponseEntity.ok(librarianService.deleteBook(id));
    }

    @PostMapping("/checkout")
    public ResponseEntity<LibrarianCheckoutResponse> checkout(@Valid @RequestBody LibrarianCheckoutRequest request) {
        return ResponseEntity.ok(librarianService.checkout(request));
    }

    @PostMapping("/checkout/guest")
    public ResponseEntity<LibrarianCheckoutResponse> guestCheckout(@Valid @RequestBody LibrarianGuestCheckoutRequest request) {
        return ResponseEntity.ok(librarianService.guestCheckout(request));
    }

    @GetMapping("/borrowers")
    public ResponseEntity<List<LibrarianBorrowerOptionResponse>> borrowers(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(librarianService.borrowers(keyword));
    }

    @PostMapping("/users")
    public ResponseEntity<LibrarianCreateUserResponse> createUser(@Valid @RequestBody LibrarianCreateUserRequest request) {
        return ResponseEntity.ok(librarianService.createUser(request));
    }

    @PostMapping("/accounts/upgrade")
    public ResponseEntity<LibrarianUpgradeAccountResponse> upgradeAccount(@Valid @RequestBody LibrarianUpgradeAccountRequest request) {
        return ResponseEntity.ok(librarianService.upgradeAccount(request));
    }

    @PostMapping("/checkin")
    public ResponseEntity<LibrarianCheckinResponse> checkin(@Valid @RequestBody LibrarianCheckinRequest request) {
        return ResponseEntity.ok(librarianService.checkin(request));
    }

    @GetMapping("/locations")
    public ResponseEntity<List<LibrarianLocationResponse>> locations() {
        return ResponseEntity.ok(librarianService.locations());
    }

    @PostMapping("/locations")
    public ResponseEntity<LibrarianLocationResponse> createLocation(@Valid @RequestBody LibrarianLocationRequest request) {
        return ResponseEntity.ok(librarianService.createLocation(request));
    }

    @PutMapping("/locations/{id}")
    public ResponseEntity<LibrarianLocationResponse> updateLocation(@PathVariable Integer id, @Valid @RequestBody LibrarianLocationRequest request) {
        return ResponseEntity.ok(librarianService.updateLocation(id, request));
    }

    @DeleteMapping("/locations/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable Integer id) {
        librarianService.deleteLocation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/authors")
    public ResponseEntity<List<LibrarianAuthorResponse>> authors() {
        return ResponseEntity.ok(librarianService.authors());
    }

    @PostMapping("/authors")
    public ResponseEntity<LibrarianAuthorResponse> createAuthor(@Valid @RequestBody LibrarianAuthorRequest request) {
        return ResponseEntity.ok(librarianService.createAuthor(request));
    }

    @PutMapping("/authors/{id}")
    public ResponseEntity<LibrarianAuthorResponse> updateAuthor(@PathVariable Integer id, @Valid @RequestBody LibrarianAuthorRequest request) {
        return ResponseEntity.ok(librarianService.updateAuthor(id, request));
    }

    @DeleteMapping("/authors/{id}")
    public ResponseEntity<Void> deleteAuthor(@PathVariable Integer id) {
        librarianService.deleteAuthor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/categories")
    public ResponseEntity<List<LibrarianCategoryResponse>> categories() {
        return ResponseEntity.ok(librarianService.categories());
    }

    @PostMapping("/categories")
    public ResponseEntity<LibrarianCategoryResponse> createCategory(@Valid @RequestBody LibrarianCategoryRequest request) {
        return ResponseEntity.ok(librarianService.createCategory(request));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<LibrarianCategoryResponse> updateCategory(@PathVariable Integer id, @Valid @RequestBody LibrarianCategoryRequest request) {
        return ResponseEntity.ok(librarianService.updateCategory(id, request));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Integer id) {
        librarianService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/renewal-requests")
    public ResponseEntity<List<LibrarianRenewalRequestResponse>> renewalRequests() {
        return ResponseEntity.ok(librarianService.renewalRequests());
    }

    @PostMapping("/renewal-requests/{recordId}/approve")
    public ResponseEntity<LibrarianApproveRenewResponse> approveRenew(@PathVariable Long recordId) {
        return ResponseEntity.ok(librarianService.approveRenew(recordId));
    }

    @PostMapping("/renewal-requests/{recordId}/reject")
    public ResponseEntity<LibrarianRejectRenewResponse> rejectRenew(@PathVariable Long recordId) {
        return ResponseEntity.ok(librarianService.rejectRenew(recordId));
    }

    @GetMapping("/fines/debtors")
    public ResponseEntity<List<LibrarianDebtorResponse>> debtors() {
        return ResponseEntity.ok(librarianService.debtors());
    }

    @GetMapping("/fines/invoices")
    public ResponseEntity<List<LibrarianFineInvoiceResponse>> fineInvoices() {
        return ResponseEntity.ok(librarianService.fineInvoices());
    }

    @GetMapping("/fines/users")
    public ResponseEntity<List<LibrarianUserFineSummaryResponse>> userFineSummaries() {
        return ResponseEntity.ok(librarianService.userFineSummaries());
    }

    @GetMapping("/accounts/membership-invoices")
    public ResponseEntity<List<LibrarianMembershipInvoiceResponse>> membershipInvoices() {
        return ResponseEntity.ok(librarianService.membershipInvoices());
    }

    @GetMapping("/incidents")
    public ResponseEntity<List<LibrarianIncidentResponse>> incidents() {
        return ResponseEntity.ok(librarianService.incidents());
    }

    @PostMapping("/incidents")
    public ResponseEntity<LibrarianIncidentResponse> createIncident(@Valid @RequestBody LibrarianIncidentRequest request) {
        return ResponseEntity.ok(librarianService.createIncident(request));
    }

    @PostMapping("/records/incidents")
    public ResponseEntity<LibrarianReportIncidentResponse> reportBorrowIncident(@Valid @RequestBody LibrarianReportIncidentRequest request) {
        return ResponseEntity.ok(librarianService.reportBorrowIncident(request));
    }
}
