import { useEffect, useMemo, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { fetchAuthPersonalData, renewMembership, upgradeMembership } from '../../api/modules/authPersonalApi';
import { fetchBorrowingData, fetchMyWaitlist, getMyBorrowRequests } from '../../api/modules/borrowingApi';
import { getStoredUser } from '../../api/session';
import type {
    CardResponse,
    MembershipPackageResponse,
    MembershipTransactionResponse,
    NotificationResponse,
    ProfileResponse,
} from '../../types/modules/authPersonal';
import type { BorrowRequestResponse } from '../../types/borrowing';
import type { BorrowingFinesResponse, BorrowingWaitlistItem } from '../../types/modules/borrowing';

const wsBaseUrl = import.meta.env.VITE_WS_BASE_URL || 'http://localhost:8080';

export function useAuthPersonal() {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [card, setCard] = useState<CardResponse | null>(null);
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [myRequests, setMyRequests] = useState<BorrowRequestResponse[]>([]);
    const [waitlist, setWaitlist] = useState<BorrowingWaitlistItem[]>([]);
    const [fines, setFines] = useState<BorrowingFinesResponse | null>(null);
    const [packages, setPackages] = useState<MembershipPackageResponse[]>([]);
    const [transactions, setTransactions] = useState<MembershipTransactionResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState(false);
    const [renewing, setRenewing] = useState(false);
    const [error, setError] = useState('');

    const appendRealtimeNotification = (payload: NotificationResponse) => {
        setNotifications((previous) => {
            if (previous.some((item) => item.id === payload.id)) {
                return previous;
            }
            return [payload, ...previous];
        });
    };

    const handleRealtimeFrame = (body: string) => {
        try {
            const payload = JSON.parse(body) as NotificationResponse;
            appendRealtimeNotification(payload);
        } catch {
            // Ignore malformed realtime messages to keep profile page stable.
        }
    };

    const loadData = async () => {
        const currentUser = getStoredUser();
        const [data, borrowingData, userRequests, userWaitlist] = await Promise.all([
            fetchAuthPersonalData(),
            fetchBorrowingData(),
            getMyBorrowRequests(currentUser?.username || ''),
            fetchMyWaitlist(),
        ]);
        setProfile(data.profile);
        setCard(data.card);
        setNotifications(data.notifications);
        setPackages(data.packages);
        setTransactions(data.transactions);
        setMyRequests(userRequests);
        setWaitlist(userWaitlist);
        setFines(borrowingData.fines);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                await loadData();
            } catch {
                setError('Khong tai duoc du lieu ho so. Vui long thu lai.');
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, []);

    useEffect(() => {
        if (!profile?.id) {
            return;
        }

        const wsUrl = `${wsBaseUrl}/ws`;
        const client = new Client({
            webSocketFactory: () => new SockJS(wsUrl),
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe(`/topic/notifications/${profile.id}`, (frame) => {
                    handleRealtimeFrame(frame.body);
                });
            },
        });

        client.activate();
        return () => {
            client.deactivate();
        };
    }, [profile?.id]);

    const handleUpgrade = async (targetPackage: string) => {
        setUpgrading(true);
        setError('');
        try {
            const result = await upgradeMembership(targetPackage);
            await loadData();
            alert(result.message || 'Nang cap goi thanh cong.');
        } catch {
            setError('Nang cap that bai. Vui long thu lai.');
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
            alert(result.message || 'Gia han goi thanh cong.');
        } catch {
            setError('Gia han that bai. Vui long thu lai.');
        } finally {
            setRenewing(false);
        }
    };

    const qrData = useMemo(() => card?.qrPayload || profile?.username || 'member', [card, profile]);

    return {
        profile,
        card,
        notifications,
        myRequests,
        waitlist,
        fines,
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
