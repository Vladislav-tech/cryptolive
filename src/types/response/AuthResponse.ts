import type { IUser } from '@/types/response/IUser';

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser;

}