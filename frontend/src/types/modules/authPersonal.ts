export interface ProfileResponse {
    id: number;
    username: string;
    fullName: string;
    email: string;
    studentId: string;
    phone: string;
    roles: string[];
    membership: string;
    borrowingCount: number;
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
