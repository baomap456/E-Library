export default interface AuthResponse {
    token: string;
    username: string;
    fullName: string;
    roles: string[];
}