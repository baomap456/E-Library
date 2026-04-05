import axiosClient from '../axiosClient';
import type {
    LibrarianAuthor,
    LibrarianBook,
    LibrarianBookPayload,
    LibrarianBorrowerOption,
    LibrarianCategory,
    LibrarianCreateUserPayload,
    LibrarianCreateUserResponse,
    LibrarianDashboard,
    LibrarianDebtor,
    LibrarianFineInvoice,
    LibrarianMembershipInvoice,
    LibrarianDigitalDocument,
    LibrarianDigitalDocumentPayload,
    LibrarianLocation,
    LibrarianMembershipPackageOption,
    LibrarianReportIncidentPayload,
    LibrarianReportIncidentResponse,
    LibrarianUserFineSummary,
    LibrarianUpgradeAccountResponse,
} from '../../types/modules/librarian';
import type { BorrowRequestResponse } from '../../types/borrowing';
import type { BorrowingRecord } from '../../types/modules/borrowing';

export async function fetchLibrarianData(): Promise<{
    dashboard: LibrarianDashboard;
    books: LibrarianBook[];
    debtors: LibrarianDebtor[];
    fineInvoices: LibrarianFineInvoice[];
    membershipInvoices: LibrarianMembershipInvoice[];
    userFineSummaries: LibrarianUserFineSummary[];
    digitalDocuments: LibrarianDigitalDocument[];
    authors: LibrarianAuthor[];
    categories: LibrarianCategory[];
    locations: LibrarianLocation[];
    membershipPackages: LibrarianMembershipPackageOption[];
    borrowers: LibrarianBorrowerOption[];
}> {
    const [dashboard, books, debtors, fineInvoices, membershipInvoices, userFineSummaries, digitalDocuments, authors, categories, locations, membershipPackages, borrowers] = await Promise.all([
        axiosClient.get<unknown, LibrarianDashboard>('/librarian/dashboard'),
        axiosClient.get<unknown, LibrarianBook[]>('/librarian/books'),
        axiosClient.get<unknown, LibrarianDebtor[]>('/librarian/fines/debtors'),
        axiosClient.get<unknown, LibrarianFineInvoice[]>('/librarian/fines/invoices'),
        axiosClient.get<unknown, LibrarianMembershipInvoice[]>('/librarian/accounts/membership-invoices'),
        axiosClient.get<unknown, LibrarianUserFineSummary[]>('/librarian/fines/users'),
        axiosClient.get<unknown, LibrarianDigitalDocument[]>('/librarian/digital-documents'),
        axiosClient.get<unknown, LibrarianAuthor[]>('/librarian/authors'),
        axiosClient.get<unknown, LibrarianCategory[]>('/librarian/categories'),
        axiosClient.get<unknown, LibrarianLocation[]>('/librarian/locations'),
        axiosClient.get<unknown, LibrarianMembershipPackageOption[]>('/profile/membership-packages'),
        axiosClient.get<unknown, LibrarianBorrowerOption[]>('/librarian/borrowers'),
    ]);

    return { dashboard, books, debtors, fineInvoices, membershipInvoices, userFineSummaries, digitalDocuments, authors, categories, locations, membershipPackages, borrowers };
}

export function createDigitalDocument(payload: LibrarianDigitalDocumentPayload) {
    return axiosClient.post('/librarian/digital-documents', payload);
}

export function updateDigitalDocument(id: number, payload: LibrarianDigitalDocumentPayload) {
    return axiosClient.put(`/librarian/digital-documents/${id}`, payload);
}

export function deleteDigitalDocument(id: number) {
    return axiosClient.delete(`/librarian/digital-documents/${id}`);
}

export function payFinePartial(recordId: number, amount: number, paymentMethod = 'CASH') {
    return axiosClient.post('/borrowing/fines/pay', { recordId, amount, paymentMethod });
}

export function checkoutBook(username: string, barcode: string, dueDate: string) {
    return axiosClient.post('/librarian/checkout', { username, barcode, dueDate });
}

export function checkinBook(barcode: string) {
    return axiosClient.post<unknown, { message: string; recordId: number; fineAmount: number }>('/librarian/checkin', { barcode });
}

export function fetchBorrowRecordByBarcode(barcode: string) {
    return axiosClient.get<unknown, BorrowingRecord>('/borrowing/records/by-barcode', { params: { barcode } });
}

export function checkoutGuestBook(
    guestName: string,
    phone: string,
    barcode: string,
    borrowMode: 'TAKE_HOME' | 'READ_ON_SITE',
    depositAmount?: number,
    citizenId?: string,
    dueDate?: string,
) {
    return axiosClient.post('/librarian/checkout/guest', {
        guestName,
        phone,
        borrowMode,
        depositAmount,
        citizenId,
        barcode,
        dueDate,
    });
}

export function createBook(payload: LibrarianBookPayload) {
    return axiosClient.post('/librarian/books', payload);
}

export function updateBook(id: number, payload: LibrarianBookPayload) {
    return axiosClient.put(`/librarian/books/${id}`, payload);
}

export function deleteBook(id: number) {
    return axiosClient.delete(`/librarian/books/${id}`);
}

export function createLibrarianUser(payload: LibrarianCreateUserPayload) {
    return axiosClient.post<unknown, LibrarianCreateUserResponse>('/librarian/users', payload);
}

export function upgradeAccountDirect(username: string, targetPackage: string) {
    return axiosClient.post<unknown, LibrarianUpgradeAccountResponse>('/librarian/accounts/upgrade', {
        username,
        targetPackage,
    });
}

export function createIncident(detail: string) {
    return axiosClient.post('/librarian/incidents', { detail });
}

export function reportBorrowIncident(payload: LibrarianReportIncidentPayload) {
    return axiosClient.post<unknown, LibrarianReportIncidentResponse>('/librarian/records/incidents', payload);
}

export function createAuthor(name: string) {
    return axiosClient.post('/librarian/authors', { name });
}

export function updateAuthor(id: number, name: string) {
    return axiosClient.put(`/librarian/authors/${id}`, { name });
}

export function deleteAuthor(id: number) {
    return axiosClient.delete(`/librarian/authors/${id}`);
}

export function createCategory(name: string) {
    return axiosClient.post('/librarian/categories', { name });
}

export function updateCategory(id: number, name: string) {
    return axiosClient.put(`/librarian/categories/${id}`, { name });
}

export function deleteCategory(id: number) {
    return axiosClient.delete(`/librarian/categories/${id}`);
}

export function createLocation(roomName: string, shelfNumber: string) {
    return axiosClient.post('/librarian/locations', { roomName, shelfNumber });
}

export function updateLocation(id: number, roomName: string, shelfNumber: string) {
    return axiosClient.put(`/librarian/locations/${id}`, { roomName, shelfNumber });
}

export function deleteLocation(id: number) {
    return axiosClient.delete(`/librarian/locations/${id}`);
}

// Borrow Request APIs
export async function getPendingBorrowRequests(): Promise<BorrowRequestResponse[]> {
    return axiosClient.get<unknown, BorrowRequestResponse[]>('/borrow-requests/pending');
}

export async function getAllBorrowRequests(): Promise<BorrowRequestResponse[]> {
    return axiosClient.get<unknown, BorrowRequestResponse[]>('/borrow-requests/all');
}

export async function approveBorrowRequest(requestId: number, note?: string): Promise<BorrowRequestResponse> {
    return axiosClient.post<unknown, BorrowRequestResponse>('/borrow-requests/approve', {
        requestId,
        approve: true,
        note,
    });
}

export async function rejectBorrowRequest(requestId: number, note?: string): Promise<BorrowRequestResponse> {
    return axiosClient.post<unknown, BorrowRequestResponse>('/borrow-requests/approve', {
        requestId,
        approve: false,
        note,
    });
}
