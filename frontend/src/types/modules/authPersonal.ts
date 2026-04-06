export interface ProfileResponse {
    id: number;
    username: string;
    fullName: string;
    email: string;
    studentId: string;
    phone: string;
    roles: string[];
    membership: string;
    membershipPaid: boolean;
    membershipMaxBooks: number;
    membershipBorrowDurationDays: number;
    membershipFineRatePerDay: number;
    membershipPrivilegeNote: string;
    membershipExpiresAt: string | null;
    membershipDaysRemaining: number | null;
    borrowingCount: number;
}

export interface MembershipPackageResponse {
    id: number;
    name: string;
    paid: boolean;
    price: number;
    maxBooks: number;
    borrowDurationDays: number;
    fineRatePerDay: number;
    privilegeNote: string;
    benefits: string[];
}

export interface MembershipTransactionResponse {
    id: number;
    actorUsername: string;
    paymentChannel?: string;
    action: string;
    fromPackage: string;
    toPackage: string;
    amount: number;
    note: string;
    createdAt: string;
}

export interface CardResponse {
    cardCode: string;
    qrPayload: string;
    validUntil: string;
}

export interface NotificationResponse {
    id: number;
    message: string;
    read: boolean;
    createdAt: string;
}
