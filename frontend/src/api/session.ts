import type UserSession from '../types/UserSession';

function normalizeRoleName(role: string): string {
    const upper = role.trim().toUpperCase();
    return upper.startsWith('ROLE_') ? upper.substring(5) : upper;
}

export function getStoredToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
}

export function getStoredUser(): UserSession | null {
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw) as UserSession;
    } catch {
        return null;
    }
}

export function hasRole(user: UserSession | null, acceptedRoles: string[]): boolean {
    if (!user?.roles || user.roles.length === 0) {
        return false;
    }
    const accepted = new Set(acceptedRoles.map(normalizeRoleName));
    return user.roles.some((role) => accepted.has(normalizeRoleName(role)));
}
