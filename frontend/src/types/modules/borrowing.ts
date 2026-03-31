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
}

export interface BorrowingFinesResponse {
    totalDebt: number;
    unpaidCount: number;
    paidHistory: Array<{ paymentId: number; amount: number; paidAt: string }>;
}

export interface BorrowingWaitlistItem {
    bookId: number;
    title: string;
    position: number;
}
