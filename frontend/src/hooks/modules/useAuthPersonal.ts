import { useEffect, useMemo, useState } from 'react';
import { fetchAuthPersonalData } from '../../api/modules/authPersonalApi';
import type { CardResponse, NotificationResponse, ProfileResponse } from '../../types/modules/authPersonal';

export function useAuthPersonal() {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [card, setCard] = useState<CardResponse | null>(null);
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await fetchAuthPersonalData();
                setProfile(data.profile);
                setCard(data.card);
                setNotifications(data.notifications);
            } catch {
                setError('Không tải được dữ liệu hồ sơ. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, []);

    const qrData = useMemo(() => card?.qrPayload || profile?.username || 'member', [card, profile]);

    return { profile, card, notifications, loading, error, qrData };
}
