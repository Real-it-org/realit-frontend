export interface SignupDto {
    email: string;
    password?: string;
    username?: string;
    displayName?: string;
}

export interface LoginDto {
    identifier: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
}
