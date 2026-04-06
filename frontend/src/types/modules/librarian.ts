export interface LibrarianDashboard {
    totalBooks: number;
    borrowingNow: number;
    borrowingsToday: number;
}

export interface LibrarianBook {
    id: number;
    title: string;
    description?: string;
    publishYear: number;
    publisher: string;
    price?: number;
    coverImageUrl?: string;
    digital?: boolean;
    canTakeHome?: boolean;
    availableCopies: number;
    availableBarcode: string | null;
    categoryId?: number | null;
    categoryName?: string | null;
    authorIds?: number[];
    authorNames?: string[];
    locationId?: number | null;
    locationLabel?: string | null;
}

export interface LibrarianBookPayload {
    title: string;
    description: string;
    publishYear: number;
    publisher: string;
    price: number;
    coverImageUrl: string;
    digital: boolean;
    authorIds: number[];
    categoryId: number;
    locationId?: number | null;
}

export interface LibrarianDebtor {
    recordId: number;
    username: string;
    fullName?: string;
    bookTitle: string;
    fineAmount: number;
    outstandingDebt?: number;
    borrowingLocked?: boolean;
    overdueDays?: number;
    overdue?: boolean;
}

export interface LibrarianFineInvoice {
    paymentId: number;
    recordId: number;
    username: string;
    fullName?: string;
    bookTitle?: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
}

export interface LibrarianUserFineSummary {
    userId: number;
    username: string;
    fullName?: string;
    totalPaidAmount: number;
    outstandingDebt: number;
    paymentCount: number;
    borrowingLocked: boolean;
}

export interface LibrarianMembershipInvoice {
    transactionId: number;
    username?: string;
    fullName?: string;
    actorUsername?: string;
    paymentChannel?: string;
    action: string;
    fromPackage?: string;
    toPackage?: string;
    amount: number;
    note?: string;
    createdAt: string;
}

export interface LibrarianAuthor {
    id: number;
    name: string;
}

export interface LibrarianCategory {
    id: number;
    name: string;
}

export interface LibrarianLocation {
    id: number;
    roomName: string;
    shelfNumber: string;
}

export interface LibrarianMembershipPackageOption {
    id: number;
    name: string;
    paid: boolean;
    price: number;
}

export interface LibrarianCreateUserPayload {
    username: string;
    password: string;
    email: string;
    fullName: string;
    studentId?: string;
}

export interface LibrarianCreateUserResponse {
    message: string;
    userId: number;
    username: string;
    email: string;
    membership: string;
}

export interface LibrarianUpgradeAccountResponse {
    message: string;
    username: string;
    fromPackage: string;
    toPackage: string;
    paidPackage: boolean;
}

export interface LibrarianBorrowerOption {
    userId: number;
    username: string;
    fullName: string;
    email: string;
    phone?: string;
    studentId?: string;
    membershipName?: string;
}

export interface LibrarianReportIncidentPayload {
    recordId: number;
    incidentType: 'LOST' | 'DAMAGED';
    damageSeverity?: 'LIGHT' | 'HEAVY';
    repairCost?: number;
    lostCompensationRate?: 100 | 150;
    compensationAmount?: number;
    note?: string;
}

export interface LibrarianReportIncidentResponse {
    message: string;
    recordId: number;
    incidentType: string;
    bookStatus: string;
    compensationAmount: number;
    deductedFromDeposit: number;
    remainingDebt: number;
    borrowingLocked: boolean;
}

export interface LibrarianDigitalDocument {
    id: number;
    title: string;
    description: string;
    publishYear: number;
    publisher: string;
    fileUrl: string;
    isbn: string;
}

export interface LibrarianDigitalDocumentPayload {
    title: string;
    description: string;
    publishYear: number;
    publisher: string;
    fileUrl: string;
    isbn: string;
}
