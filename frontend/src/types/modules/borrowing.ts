export interface BorrowingCartItem {
    bookId: number;
    title: string;
}

export interface BorrowingRecord {
    recordId: number;
    userId?: number | null;
    username?: string;
    userFullName?: string;
    bookId?: number | null;
    bookItemId?: number | null;
    bookTitle: string;
    barcode?: string;
    borrowDate?: string;
    dueDate: string;
    returnDate: string;
    status: string;
    renewalCount: number;
    maxRenewals: number;
    canRenew: boolean;
    renewDisabledReason: string | null;
    daysUntilDue: number;
    borrowMode?: 'TAKE_HOME' | 'READ_ON_SITE';
    depositAmount?: number;
    borrowerCitizenId?: string | null;
    temporaryRecord?: boolean;
    fineAmount?: number;
    incidentType?: string | null;
    damageSeverity?: string | null;
    compensationAmount?: number | null;
    incidentNote?: string | null;
}

export interface BorrowingFinesResponse {
    totalDebt: number;
    unpaidCount: number;
    paidHistory: Array<{
        paymentId: number;
        recordId?: number;
        amount: number;
        paidAt: string;
        paymentMethod?: string;
    }>;
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
