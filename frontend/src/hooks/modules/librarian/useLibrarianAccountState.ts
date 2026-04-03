import { useState } from 'react';

export function useLibrarianAccountState() {
    const [newUserUsername, setNewUserUsername] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserFullName, setNewUserFullName] = useState('');
    const [newUserStudentId, setNewUserStudentId] = useState('');
    const [upgradeUsername, setUpgradeUsername] = useState('reader01');
    const [upgradeTargetPackage, setUpgradeTargetPackage] = useState('Premium');

    return {
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
    };
}