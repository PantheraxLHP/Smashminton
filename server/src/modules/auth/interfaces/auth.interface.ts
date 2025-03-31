export interface AuthRequest {
    username: string;
    password: string;
}

export interface SignInData {
    accountid: number;
    username: string;
    accounttype: string;
}

export interface AuthResponse {
    accessToken: string;
}
