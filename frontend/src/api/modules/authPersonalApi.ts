import axiosClient from '../axiosClient';
import type { CardResponse, NotificationResponse, ProfileResponse } from '../../types/modules/authPersonal';

export async function fetchAuthPersonalData(): Promise<{
    profile: ProfileResponse;
    card: CardResponse;
    notifications: NotificationResponse[];
}> {
    const [profile, card, notifications] = await Promise.all([
        axiosClient.get<unknown, ProfileResponse>('/profile/me'),
        axiosClient.get<unknown, CardResponse>('/profile/library-card'),
        axiosClient.get<unknown, NotificationResponse[]>('/notifications/me'),
    ]);

    return { profile, card, notifications };
}
