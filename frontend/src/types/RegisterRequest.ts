export default interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    fullName: string;
    studentId?: string;
}
