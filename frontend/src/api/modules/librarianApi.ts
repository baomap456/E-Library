import axiosClient from '../axiosClient';
import type { LibrarianBook, LibrarianDashboard, LibrarianDebtor } from '../../types/modules/librarian';

export async function fetchLibrarianData(): Promise<{
    dashboard: LibrarianDashboard;
    books: LibrarianBook[];
    debtors: LibrarianDebtor[];
}> {
    const [dashboard, books, debtors] = await Promise.all([
        axiosClient.get<unknown, LibrarianDashboard>('/librarian/dashboard'),
        axiosClient.get<unknown, LibrarianBook[]>('/librarian/books'),
        axiosClient.get<unknown, LibrarianDebtor[]>('/librarian/fines/debtors'),
    ]);

    return { dashboard, books, debtors };
}

export function checkoutBook(username: string, barcode: string) {
    return axiosClient.post('/librarian/checkout', { username, barcode });
}

export function checkinBook(barcode: string) {
    return axiosClient.post('/librarian/checkin', { barcode });
}

export function createIncident(detail: string) {
    return axiosClient.post('/librarian/incidents', { detail });
}
