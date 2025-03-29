export interface AuthRequest {
    username: string;
    password: string;
}

export interface SignInData {
    accountid: number;
    username: string;
}

export interface AuthResponse {
    accessToken: string;
}
