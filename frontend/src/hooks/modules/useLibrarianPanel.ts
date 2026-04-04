import { useEffect, useState } from 'react';
import {
    checkinBook,
    checkoutGuestBook,
    checkoutBook,
    createBook,
    createDigitalDocument,
    createLibrarianUser,
    deleteBook,
    deleteDigitalDocument,
    createAuthor,
    createCategory,
    createIncident,
    createLocation,
    deleteAuthor,
    deleteCategory,
    deleteLocation,
    fetchLibrarianData,
    payFinePartial,
    reportBorrowIncident,
    updateBook,
    updateDigitalDocument,
    upgradeAccountDirect,
    updateAuthor,
    updateCategory,
    updateLocation,
} from '../../api/modules/librarianApi';
import { useLibrarianAccountState } from './librarian/useLibrarianAccountState';
import { useLibrarianCatalogFormsState } from './librarian/useLibrarianCatalogFormsState';
import { useLibrarianCirculationState } from './librarian/useLibrarianCirculationState';
import { useLibrarianIncidentState } from './librarian/useLibrarianIncidentState';
import type {
    LibrarianAuthor,
    LibrarianBook,
    LibrarianBorrowerOption,
    LibrarianCategory,
    LibrarianDashboard,
    LibrarianDebtor,
    LibrarianDigitalDocument,
    LibrarianLocation,
    LibrarianMembershipPackageOption,
} from '../../types/modules/librarian';

export function useLibrarianPanel() {
    const [dashboard, setDashboard] = useState<LibrarianDashboard | null>(null);
    const [books, setBooks] = useState<LibrarianBook[]>([]);
    const [debtors, setDebtors] = useState<LibrarianDebtor[]>([]);
    const [digitalDocuments, setDigitalDocuments] = useState<LibrarianDigitalDocument[]>([]);
    const [authors, setAuthors] = useState<LibrarianAuthor[]>([]);
    const [categories, setCategories] = useState<LibrarianCategory[]>([]);
    const [locations, setLocations] = useState<LibrarianLocation[]>([]);
    const [borrowers, setBorrowers] = useState<LibrarianBorrowerOption[]>([]);
    const [membershipPackages, setMembershipPackages] = useState<LibrarianMembershipPackageOption[]>([]);
    const circulationState = useLibrarianCirculationState();
    const accountState = useLibrarianAccountState();
    const incidentState = useLibrarianIncidentState();
    const catalogFormsState = useLibrarianCatalogFormsState();

    const {
        barcode,
        setBarcode,
        username,
        setUsername,
        guestBorrowMode,
        setGuestBorrowMode,
        guestName,
        setGuestName,
        guestPhone,
        setGuestPhone,
        guestLoanType,
        setGuestLoanType,
        guestDepositAmount,
        setGuestDepositAmount,
        guestCitizenId,
        setGuestCitizenId,
        debtPaymentRecordId,
        setDebtPaymentRecordId,
        debtPaymentAmount,
        setDebtPaymentAmount,
    } = circulationState;

    const {
        newUserUsername,
        setNewUserUsername,
        newUserPassword,
        setNewUserPassword,
        newUserEmail,
        setNewUserEmail,
        newUserFullName,
        setNewUserFullName,
        newUserStudentId,
        setNewUserStudentId,
        upgradeUsername,
        setUpgradeUsername,
        upgradeTargetPackage,
        setUpgradeTargetPackage,
    } = accountState;

    const {
        incident,
        setIncident,
        incidentRecordId,
        setIncidentRecordId,
        incidentType,
        setIncidentType,
        damageSeverity,
        setDamageSeverity,
        repairCost,
        setRepairCost,
        lostCompensationRate,
        setLostCompensationRate,
    } = incidentState;

    const {
        newAuthor,
        setNewAuthor,
        digitalTitle,
        setDigitalTitle,
        digitalDescription,
        setDigitalDescription,
        digitalPublisher,
        setDigitalPublisher,
        digitalPublishYear,
        setDigitalPublishYear,
        digitalFileUrl,
        setDigitalFileUrl,
        digitalIsbn,
        setDigitalIsbn,
        newCategory,
        setNewCategory,
        newRoom,
        setNewRoom,
        newShelf,
        setNewShelf,
    } = catalogFormsState;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadData = async () => {
        const data = await fetchLibrarianData();
        setDashboard(data.dashboard);
        setBooks(data.books);
        setDebtors(data.debtors);
        setDigitalDocuments(data.digitalDocuments);
        setAuthors(data.authors);
        setCategories(data.categories);
        setLocations(data.locations);
        setBorrowers(data.borrowers);

        const paidPackages = data.membershipPackages.filter((item) => item.paid);
        setMembershipPackages(paidPackages);
        if (paidPackages.length > 0 && !paidPackages.some((item) => item.name === upgradeTargetPackage)) {
            setUpgradeTargetPackage(paidPackages[0].name);
        }
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
        if (!username.trim()) {
            setError('Vui lòng chọn người mượn.');
            return;
        }
        if (!barcode.trim()) {
            setError('Vui lòng chọn sách để lập phiếu mượn.');
            return;
        }
        try {
            await checkoutBook(username, barcode);
            setError('');
            await loadData();
        } catch {
            setError('Check-out thất bại.');
        }
    };

    const handleGuestCheckout = async () => {
        if (!guestName.trim()) {
            setError('Vui lòng nhập tên khách.');
            return;
        }
        if (!barcode.trim()) {
            setError('Vui lòng chọn sách để lập phiếu mượn.');
            return;
        }

        const numericDeposit = Number.parseFloat(guestDepositAmount || '0');
        if (guestLoanType === 'TAKE_HOME' && (!Number.isFinite(numericDeposit) || numericDeposit <= 0)) {
            setError('Khách mượn mang về phải có tiền cọc ứng trước > 0.');
            return;
        }
        if (guestLoanType === 'TAKE_HOME' && !/^\d{9,12}$/.test(guestCitizenId.trim())) {
            setError('Khách mượn mang về phải nhập CCCD hợp lệ (9-12 chữ số).');
            return;
        }

        try {
            await checkoutGuestBook(
                guestName.trim(),
                guestPhone.trim(),
                barcode,
                guestLoanType,
                guestLoanType === 'TAKE_HOME' ? numericDeposit : 0,
                guestLoanType === 'TAKE_HOME' ? guestCitizenId.trim() : undefined,
            );
            setError('');
            setGuestName('');
            setGuestPhone('');
            setGuestLoanType('TAKE_HOME');
            setGuestDepositAmount('');
            setGuestCitizenId('');
            await loadData();
        } catch {
            setError('Lập phiếu mượn cho khách thất bại.');
        }
    };

    const handleCheckin = async () => {
        try {
            const result = await checkinBook(barcode);
            if ((result.fineAmount || 0) > 0) {
                setDebtPaymentRecordId(String(result.recordId));
                setDebtPaymentAmount(String(Math.round(result.fineAmount)));
                setError(`Sách trả quá hạn. Hệ thống đã tính phí ${Math.round(result.fineAmount).toLocaleString('vi-VN')} VND.`);
            } else {
                setError('');
            }
            await loadData();
        } catch {
            setError('Check-in thất bại.');
        }
    };

    const handleCreateUserDirect = async () => {
        if (!newUserUsername.trim() || !newUserPassword.trim() || !newUserEmail.trim() || !newUserFullName.trim()) {
            setError('Vui lòng nhập đủ thông tin bắt buộc để tạo người dùng.');
            return;
        }

        try {
            const result = await createLibrarianUser({
                username: newUserUsername.trim(),
                password: newUserPassword,
                email: newUserEmail.trim(),
                fullName: newUserFullName.trim(),
                studentId: newUserStudentId.trim() || undefined,
            });
            setError('');
            setNewUserUsername('');
            setNewUserPassword('');
            setNewUserEmail('');
            setNewUserFullName('');
            setNewUserStudentId('');
            await loadData();
            alert(result.message || 'Tạo người dùng thành công.');
        } catch {
            setError('Không thể tạo người dùng mới.');
        }
    };

    const handleUpgradeAccountDirect = async () => {
        if (!upgradeUsername.trim() || !upgradeTargetPackage.trim()) {
            setError('Vui lòng nhập username và gói cần nâng cấp.');
            return;
        }

        try {
            const result = await upgradeAccountDirect(upgradeUsername.trim(), upgradeTargetPackage.trim());
            setError('');
            await loadData();
            alert(result.message || 'Nâng cấp tài khoản thành công.');
        } catch {
            setError('Không thể nâng cấp tài khoản trực tiếp.');
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

    const handleReportBorrowIncident = async () => {
        const recordId = Number.parseInt(incidentRecordId, 10);
        if (!Number.isFinite(recordId) || recordId <= 0) {
            setError('Vui lòng nhập mã phiếu mượn hợp lệ để ghi nhận sự cố.');
            return;
        }

        if (incidentType === 'DAMAGED') {
            const repair = Number.parseFloat(repairCost || '0');
            if (!Number.isFinite(repair) || repair <= 0) {
                setError('Vui lòng nhập chi phí sửa chữa hợp lệ cho sự cố hư hại.');
                return;
            }
        }

        // Calculate compensation amount for LOST books
        let compensationAmountValue: number | undefined;
        if (incidentType === 'LOST') {
            const selectedDebtor = debtors.find((d) => String(d.recordId) === incidentRecordId);
            const selectedBook = selectedDebtor ? books.find((b) => b.title === selectedDebtor.bookTitle) : null;
            if (selectedBook && lostCompensationRate) {
                compensationAmountValue = ((selectedBook.price || 0) * Number.parseInt(lostCompensationRate, 10)) / 100;
            }
        }

        try {
            const result = await reportBorrowIncident({
                recordId,
                incidentType,
                damageSeverity: incidentType === 'DAMAGED' ? damageSeverity : undefined,
                repairCost: incidentType === 'DAMAGED' ? Number.parseFloat(repairCost) : undefined,
                lostCompensationRate: incidentType === 'LOST' ? Number.parseInt(lostCompensationRate, 10) as 100 | 150 : undefined,
                compensationAmount: compensationAmountValue,
                note: incident.trim() || undefined,
            });
            setError('');
            setIncidentRecordId('');
            setIncident('');
            setRepairCost('');
            await loadData();
            alert(result.message || 'Đã ghi nhận sự cố.');
        } catch {
            setError('Không thể ghi nhận sự cố mất/hư hại cho phiếu mượn.');
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

    const handleCreateBook = async (payload: {
        title: string;
        description: string;
        publishYear: number;
        publisher: string;
        price: number;
        coverImageUrl: string;
        digital: boolean;
    }) => {
        await createBook(payload);
        await loadData();
    };

    const handleUpdateBook = async (id: number, payload: {
        title: string;
        description: string;
        publishYear: number;
        publisher: string;
        price: number;
        coverImageUrl: string;
        digital: boolean;
    }) => {
        await updateBook(id, payload);
        await loadData();
    };

    const handleDeleteBook = async (id: number) => {
        await deleteBook(id);
        await loadData();
    };

    const handleCreateDigitalDocument = async () => {
        if (!digitalTitle.trim() || !digitalFileUrl.trim() || !digitalPublishYear.trim()) {
            setError('Vui lòng nhập đủ thông tin tài liệu số (tên, năm, file URL).');
            return;
        }
        await createDigitalDocument({
            title: digitalTitle.trim(),
            description: digitalDescription.trim(),
            publishYear: Number.parseInt(digitalPublishYear, 10),
            publisher: digitalPublisher.trim(),
            fileUrl: digitalFileUrl.trim(),
            isbn: digitalIsbn.trim(),
        });
        setDigitalTitle('');
        setDigitalDescription('');
        setDigitalPublisher('');
        setDigitalPublishYear('2026');
        setDigitalFileUrl('');
        setDigitalIsbn('');
        await loadData();
    };

    const handleUpdateDigitalDocument = async (id: number, payload: {
        title: string;
        description: string;
        publishYear: number;
        publisher: string;
        fileUrl: string;
        isbn: string;
    }) => {
        await updateDigitalDocument(id, payload);
        await loadData();
    };

    const handleDeleteDigitalDocument = async (id: number) => {
        await deleteDigitalDocument(id);
        await loadData();
    };

    const handlePartialDebtPayment = async () => {
        const recordId = Number.parseInt(debtPaymentRecordId, 10);
        const amount = Number.parseFloat(debtPaymentAmount);
        if (!Number.isFinite(recordId) || recordId <= 0 || !Number.isFinite(amount) || amount <= 0) {
            setError('Vui lòng nhập mã phiếu và số tiền thanh toán hợp lệ.');
            return;
        }
        await payFinePartial(recordId, amount, 'CASH');
        setDebtPaymentRecordId('');
        setDebtPaymentAmount('');
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
        digitalDocuments,
        authors,
        categories,
        locations,
        borrowers,
        membershipPackages,
        barcode,
        setBarcode,
        username,
        setUsername,
        guestBorrowMode,
        setGuestBorrowMode,
        guestName,
        setGuestName,
        guestPhone,
        setGuestPhone,
        guestLoanType,
        setGuestLoanType,
        guestDepositAmount,
        setGuestDepositAmount,
        guestCitizenId,
        setGuestCitizenId,
        newUserUsername,
        setNewUserUsername,
        newUserPassword,
        setNewUserPassword,
        newUserEmail,
        setNewUserEmail,
        newUserFullName,
        setNewUserFullName,
        newUserStudentId,
        setNewUserStudentId,
        upgradeUsername,
        setUpgradeUsername,
        upgradeTargetPackage,
        setUpgradeTargetPackage,
        incident,
        setIncident,
        incidentRecordId,
        setIncidentRecordId,
        incidentType,
        setIncidentType,
        damageSeverity,
        setDamageSeverity,
        repairCost,
        setRepairCost,
        lostCompensationRate,
        setLostCompensationRate,
        newAuthor,
        setNewAuthor,
        digitalTitle,
        setDigitalTitle,
        digitalDescription,
        setDigitalDescription,
        digitalPublisher,
        setDigitalPublisher,
        digitalPublishYear,
        setDigitalPublishYear,
        digitalFileUrl,
        setDigitalFileUrl,
        digitalIsbn,
        setDigitalIsbn,
        debtPaymentRecordId,
        setDebtPaymentRecordId,
        debtPaymentAmount,
        setDebtPaymentAmount,
        newCategory,
        setNewCategory,
        newRoom,
        setNewRoom,
        newShelf,
        setNewShelf,
        loading,
        error,
        handleCheckout,
        handleGuestCheckout,
        handleCheckin,
        handleCreateUserDirect,
        handleUpgradeAccountDirect,
        handleIncident,
        handleReportBorrowIncident,
        handleCreateBook,
        handleUpdateBook,
        handleDeleteBook,
        handleCreateAuthor,
        handleCreateDigitalDocument,
        handleUpdateDigitalDocument,
        handleDeleteDigitalDocument,
        handlePartialDebtPayment,
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
