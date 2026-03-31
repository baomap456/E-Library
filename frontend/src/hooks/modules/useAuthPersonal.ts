import { useEffect, useMemo, useState } from 'react';
import { fetchAuthPersonalData, renewMembership, upgradeMembership } from '../../api/modules/authPersonalApi';
import type {
    CardResponse,
    MembershipPackageResponse,
    MembershipTransactionResponse,
    NotificationResponse,
    ProfileResponse,
} from '../../types/modules/authPersonal';

export function useAuthPersonal() {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [card, setCard] = useState<CardResponse | null>(null);
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [packages, setPackages] = useState<MembershipPackageResponse[]>([]);
    const [transactions, setTransactions] = useState<MembershipTransactionResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState(false);
    const [renewing, setRenewing] = useState(false);
    const [error, setError] = useState('');

    const loadData = async () => {
        const data = await fetchAuthPersonalData();
        setProfile(data.profile);
        setCard(data.card);
        setNotifications(data.notifications);
        setPackages(data.packages);
        setTransactions(data.transactions);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                await loadData();
            } catch {
                setError('Không tải được dữ liệu hồ sơ. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, []);

    const handleUpgrade = async (targetPackage: string) => {
        setUpgrading(true);
        setError('');
        try {
            const result = await upgradeMembership(targetPackage);
            await loadData();
            alert(result.message || 'Nâng cấp gói thành công.');
        } catch {
            setError('Nâng cấp thất bại. Vui lòng thử lại.');
        } finally {
            setUpgrading(false);
        }
    };

    const handleRenew = async () => {
        setRenewing(true);
        setError('');
        try {
            const result = await renewMembership();
            await loadData();
            alert(result.message || 'Gia hạn gói thành công.');
        } catch {
            setError('Gia hạn thất bại. Vui lòng thử lại.');
        } finally {
            setRenewing(false);
        }
    };

    const qrData = useMemo(() => card?.qrPayload || profile?.username || 'member', [card, profile]);

    return {
        profile,
        card,
        notifications,
        packages,
        transactions,
        loading,
        upgrading,
        renewing,
        error,
        qrData,
        handleUpgrade,
        handleRenew,
    };
}
