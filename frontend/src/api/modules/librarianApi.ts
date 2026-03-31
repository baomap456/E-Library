import axiosClient from '../axiosClient';
import type {
    LibrarianAuthor,
    LibrarianBook,
    LibrarianCategory,
    LibrarianDashboard,
    LibrarianDebtor,
    LibrarianLocation,
} from '../../types/modules/librarian';
import type { BorrowRequestResponse } from '../../types/borrowing';

export async function fetchLibrarianData(): Promise<{
    dashboard: LibrarianDashboard;
    books: LibrarianBook[];
    debtors: LibrarianDebtor[];
    authors: LibrarianAuthor[];
    categories: LibrarianCategory[];
    locations: LibrarianLocation[];
}> {
    const [dashboard, books, debtors, authors, categories, locations] = await Promise.all([
        axiosClient.get<unknown, LibrarianDashboard>('/librarian/dashboard'),
        axiosClient.get<unknown, LibrarianBook[]>('/librarian/books'),
        axiosClient.get<unknown, LibrarianDebtor[]>('/librarian/fines/debtors'),
        axiosClient.get<unknown, LibrarianAuthor[]>('/librarian/authors'),
        axiosClient.get<unknown, LibrarianCategory[]>('/librarian/categories'),
        axiosClient.get<unknown, LibrarianLocation[]>('/librarian/locations'),
    ]);

    return { dashboard, books, debtors, authors, categories, locations };
}

export function checkoutBook(username: string, barcode: string) {
    return axiosClient.post('/librarian/checkout', { username, barcode });
}

export function checkinBook(barcode: string) {
    return axiosClient.post('/librarian/checkin', { barcode });
}

export function createIncident(detail: string) {
    return axiosClient.post('/librarian/incidents', { detail });
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
