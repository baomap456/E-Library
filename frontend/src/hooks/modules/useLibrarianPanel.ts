import { useEffect, useState } from 'react';
import {
    checkinBook,
    checkoutBook,
    createAuthor,
    createCategory,
    createIncident,
    createLocation,
    deleteAuthor,
    deleteCategory,
    deleteLocation,
    fetchLibrarianData,
    updateAuthor,
    updateCategory,
    updateLocation,
} from '../../api/modules/librarianApi';
import type {
    LibrarianAuthor,
    LibrarianBook,
    LibrarianCategory,
    LibrarianDashboard,
    LibrarianDebtor,
    LibrarianLocation,
} from '../../types/modules/librarian';

export function useLibrarianPanel() {
    const [dashboard, setDashboard] = useState<LibrarianDashboard | null>(null);
    const [books, setBooks] = useState<LibrarianBook[]>([]);
    const [debtors, setDebtors] = useState<LibrarianDebtor[]>([]);
    const [authors, setAuthors] = useState<LibrarianAuthor[]>([]);
    const [categories, setCategories] = useState<LibrarianCategory[]>([]);
    const [locations, setLocations] = useState<LibrarianLocation[]>([]);
    const [barcode, setBarcode] = useState('BC-00001');
    const [username, setUsername] = useState('reader01');
    const [incident, setIncident] = useState('');
    const [newAuthor, setNewAuthor] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newRoom, setNewRoom] = useState('');
    const [newShelf, setNewShelf] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadData = async () => {
        const data = await fetchLibrarianData();
        setDashboard(data.dashboard);
        setBooks(data.books);
        setDebtors(data.debtors);
        setAuthors(data.authors);
        setCategories(data.categories);
        setLocations(data.locations);
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

    const handleCreateAuthor = async () => {
        if (!newAuthor.trim()) {
            return;
        }
        await createAuthor(newAuthor.trim());
        setNewAuthor('');
        await loadData();
    };

    const handleUpdateAuthor = async (id: number, name: string) => {
        await updateAuthor(id, name);
        await loadData();
    };

    const handleDeleteAuthor = async (id: number) => {
        await deleteAuthor(id);
        await loadData();
    };

    const handleCreateCategory = async () => {
        if (!newCategory.trim()) {
            return;
        }
        await createCategory(newCategory.trim());
        setNewCategory('');
        await loadData();
    };

    const handleUpdateCategory = async (id: number, name: string) => {
        await updateCategory(id, name);
        await loadData();
    };

    const handleDeleteCategory = async (id: number) => {
        await deleteCategory(id);
        await loadData();
    };

    const handleCreateLocation = async () => {
        if (!newRoom.trim() || !newShelf.trim()) {
            return;
        }
        await createLocation(newRoom.trim(), newShelf.trim());
        setNewRoom('');
        setNewShelf('');
        await loadData();
    };

    const handleUpdateLocation = async (id: number, roomName: string, shelfNumber: string) => {
        await updateLocation(id, roomName, shelfNumber);
        await loadData();
    };

    const handleDeleteLocation = async (id: number) => {
        await deleteLocation(id);
        await loadData();
    };

    return {
        dashboard,
        books,
        debtors,
        authors,
        categories,
        locations,
        barcode,
        setBarcode,
        username,
        setUsername,
        incident,
        setIncident,
        newAuthor,
        setNewAuthor,
        newCategory,
        setNewCategory,
        newRoom,
        setNewRoom,
        newShelf,
        setNewShelf,
        loading,
        error,
        handleCheckout,
        handleCheckin,
        handleIncident,
        handleCreateAuthor,
        handleUpdateAuthor,
        handleDeleteAuthor,
        handleCreateCategory,
        handleUpdateCategory,
        handleDeleteCategory,
        handleCreateLocation,
        handleUpdateLocation,
        handleDeleteLocation,
    };
}
