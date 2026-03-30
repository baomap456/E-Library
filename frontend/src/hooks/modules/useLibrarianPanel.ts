import { useEffect, useState } from 'react';
import { checkinBook, checkoutBook, createIncident, fetchLibrarianData } from '../../api/modules/librarianApi';
import type { LibrarianBook, LibrarianDashboard, LibrarianDebtor } from '../../types/modules/librarian';

export function useLibrarianPanel() {
    const [dashboard, setDashboard] = useState<LibrarianDashboard | null>(null);
    const [books, setBooks] = useState<LibrarianBook[]>([]);
    const [debtors, setDebtors] = useState<LibrarianDebtor[]>([]);
    const [barcode, setBarcode] = useState('BC-00001');
    const [username, setUsername] = useState('reader01');
    const [incident, setIncident] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadData = async () => {
        const data = await fetchLibrarianData();
        setDashboard(data.dashboard);
        setBooks(data.books);
        setDebtors(data.debtors);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                await loadData();
            } catch {
                setError('Không tải được dữ liệu thủ thư. Hãy kiểm tra tài khoản ROLE_LIBRARIAN.');
            } finally {
                setLoading(false);
            }
        };
        void fetchData();
    }, []);

    const handleCheckout = async () => {
        try {
            await checkoutBook(username, barcode);
            await loadData();
        } catch {
            setError('Check-out thất bại.');
        }
    };

    const handleCheckin = async () => {
        try {
            await checkinBook(barcode);
            await loadData();
        } catch {
            setError('Check-in thất bại.');
        }
    };

    const handleIncident = async () => {
        if (!incident.trim()) {
            return;
        }
        try {
            await createIncident(incident);
            setIncident('');
        } catch {
            setError('Không thể lập biên bản sự cố.');
        }
    };

    return {
        dashboard,
        books,
        debtors,
        barcode,
        setBarcode,
        username,
        setUsername,
        incident,
        setIncident,
        loading,
        error,
        handleCheckout,
        handleCheckin,
        handleIncident,
    };
}
