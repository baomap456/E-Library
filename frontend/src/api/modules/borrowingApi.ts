import axiosClient from '../axiosClient';
import type {
    BorrowingCartItem,
    BorrowingFinesResponse,
    BorrowingRecord,
    BorrowingWaitlistItem,
} from '../../types/modules/borrowing';
import type { ProfileResponse } from '../../types/modules/authPersonal';
import type { BorrowRequestResponse } from '../../types/borrowing';

export async function fetchBorrowingData(): Promise<{
    cart: BorrowingCartItem[];
    records: BorrowingRecord[];
    fines: BorrowingFinesResponse;
}> {
    const [cart, records, fines] = await Promise.all([
        axiosClient.get<unknown, BorrowingCartItem[]>('/borrowing/cart'),
        axiosClient.get<unknown, BorrowingRecord[]>('/borrowing/records'),
        axiosClient.get<unknown, BorrowingFinesResponse>('/borrowing/fines'),
    ]);

    return { cart, records, fines };
}

export function renewBorrowingRecord(recordId: number) {
    return axiosClient.patch(`/borrowing/records/${recordId}/renew`, {});
}

export function joinBorrowingWaitlist(bookId: number) {
    return axiosClient.post('/borrowing/waitlist', { bookId });
}

export function fetchMyWaitlist() {
    return axiosClient.get<unknown, BorrowingWaitlistItem[]>('/borrowing/waitlist/me');
}

export function fetchMyProfileForBorrowing() {
    return axiosClient.get<unknown, ProfileResponse>('/profile/me');
}

/**
 * User submits a borrow request for a book item
 */
export async function submitBorrowRequest(
    bookId: number,
    requestedPickupDate?: string,
    requestedReturnDate?: string,
): Promise<BorrowRequestResponse> {
    const userRaw = localStorage.getItem('user') || sessionStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    const resolvedRequestedPickupDate = requestedPickupDate ?? (() => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return date.toISOString().slice(0, 10);
    })();
    const resolvedRequestedReturnDate = requestedReturnDate ?? (() => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date.toISOString().slice(0, 10);
    })();

    return axiosClient.post<unknown, BorrowRequestResponse>('/borrow-requests/create', {
        username: user?.username || '',
        bookId,
        requestedPickupDate: resolvedRequestedPickupDate,
        requestedReturnDate: resolvedRequestedReturnDate,
    });
}

/**
 * User gets their own borrow requests
 */
export async function getMyBorrowRequests(username: string): Promise<BorrowRequestResponse[]> {
    return axiosClient.get<unknown, BorrowRequestResponse[]>('/borrow-requests/my-requests', {
        params: { username },
    });
}

/**
 * User cancels a pending borrow request
 */
export async function cancelBorrowRequest(requestId: number): Promise<BorrowRequestResponse> {
    return axiosClient.delete<unknown, BorrowRequestResponse>(`/borrow-requests/${requestId}`);
}
