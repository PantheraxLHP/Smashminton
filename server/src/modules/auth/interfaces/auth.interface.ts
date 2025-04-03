export interface AuthRequest {
    username: string;
    password: string;
}

export interface SignInData {
    accountid: number;
    username: string;
    accounttype: string;
    role?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken?: string;
}
