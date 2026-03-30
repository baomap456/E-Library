import axiosClient from '../axiosClient';
import type { BorrowingCartItem, BorrowingFinesResponse, BorrowingRecord } from '../../types/modules/borrowing';

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
