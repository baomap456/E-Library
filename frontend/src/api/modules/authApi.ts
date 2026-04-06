import axiosClient from '../axiosClient';

export type ForgotPasswordRequest = {
    identifier: string;
};

export type ForgotPasswordResponse = {
    message: string;
    tempPassword: string;
};

export function forgotPassword(request: ForgotPasswordRequest) {
    return axiosClient.post<unknown, ForgotPasswordResponse>('/auth/forgot-password', request);
}
