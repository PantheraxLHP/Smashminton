export interface AuthRequest {
    username: string;
    password: string;
}

export interface SignInData {
    accountid: number;
    username: string;
    accounttype: string;
    role?: string;
    avatarurl?: string;
    isStudent?: boolean;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken?: string;
}
