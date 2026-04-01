export interface BorrowingCartItem {
    bookId: number;
    title: string;
}

export interface BorrowingRecord {
    recordId: number;
    bookTitle: string;
    dueDate: string;
    returnDate: string;
    status: string;
    renewalCount: number;
    maxRenewals: number;
    canRenew: boolean;
    renewDisabledReason: string | null;
    daysUntilDue: number;
}

export interface BorrowingFinesResponse {
    totalDebt: number;
    unpaidCount: number;
    paidHistory: Array<{ paymentId: number; amount: number; paidAt: string }>;
}

export interface BorrowingWaitlistItem {
    reservationId: number;
    bookId: number;
    title: string;
    position: number;
    status: 'PENDING' | 'NOTIFIED' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED';
    expiryDate: string | null;
}

export interface BorrowingWaitlistJoinResponse {
    message: string;
    bookId: number;
    position: number;
}
