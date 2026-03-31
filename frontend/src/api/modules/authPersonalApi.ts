import axiosClient from '../axiosClient';
import type {
    CardResponse,
    MembershipPackageResponse,
    MembershipTransactionResponse,
    NotificationResponse,
    ProfileResponse,
} from '../../types/modules/authPersonal';

export async function fetchAuthPersonalData(): Promise<{
    profile: ProfileResponse;
    card: CardResponse;
    notifications: NotificationResponse[];
    packages: MembershipPackageResponse[];
    transactions: MembershipTransactionResponse[];
}> {
    const [profile, card, notifications, packages, transactions] = await Promise.all([
        axiosClient.get<unknown, ProfileResponse>('/profile/me'),
        axiosClient.get<unknown, CardResponse>('/profile/library-card'),
        axiosClient.get<unknown, NotificationResponse[]>('/notifications/me'),
        axiosClient.get<unknown, MembershipPackageResponse[]>('/profile/membership-packages'),
        axiosClient.get<unknown, MembershipTransactionResponse[]>('/profile/membership/transactions'),
    ]);

    return { profile, card, notifications, packages, transactions };
}

export async function upgradeMembership(targetPackage: string): Promise<{ message: string }> {
    return axiosClient.post('/profile/membership/upgrade', { targetPackage });
}

export async function renewMembership(): Promise<{ message: string }> {
    return axiosClient.post('/profile/membership/renew', {});
}
