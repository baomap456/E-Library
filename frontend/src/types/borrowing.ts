export interface BorrowRequestResponse {
    id: number;
    userId: number;
    bookId: number;
    bookItemId: number;
    username?: string;
    userFullName?: string;
    bookTitle?: string;
    isbn?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    requestDate: string;
    requestedPickupDate?: string;
    requestedReturnDate?: string;
    approvalDate?: string;
    approvedByUsername?: string;
    approvalNote?: string;
}

export interface CreateBorrowRequestDto {
    username: string;
    bookId: number;
    requestedPickupDate: string;
    requestedReturnDate: string;
}

export interface ApproveBorrowRequestDto {
    requestId: number;
    approve: boolean;
    note?: string;
}
