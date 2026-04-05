import { useState } from 'react';

export function useLibrarianCirculationState() {
    const [barcode, setBarcode] = useState('');
    const [username, setUsername] = useState('reader01');
    const [guestBorrowMode, setGuestBorrowMode] = useState(false);
    const [guestName, setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [guestLoanType, setGuestLoanType] = useState<'TAKE_HOME' | 'READ_ON_SITE'>('TAKE_HOME');
    const [guestDepositAmount, setGuestDepositAmount] = useState('');
    const [guestCitizenId, setGuestCitizenId] = useState('');
    const [borrowDueDate, setBorrowDueDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date.toISOString().slice(0, 16);
    });
    const [debtPaymentRecordId, setDebtPaymentRecordId] = useState('');
    const [debtPaymentAmount, setDebtPaymentAmount] = useState('');

    return {
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
        borrowDueDate,
        setBorrowDueDate,
        debtPaymentRecordId,
        setDebtPaymentRecordId,
        debtPaymentAmount,
        setDebtPaymentAmount,
    };
}