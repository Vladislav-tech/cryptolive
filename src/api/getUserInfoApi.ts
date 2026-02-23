import api from '@/api/axiosInstance';

export interface UserInfo {
    email: string;
    name: string;
    registrationDate: string;
    lastSignInDate: string;
    favorites: number;
}

export const getUserInfo = async () => {
    try {
        return api.get<UserInfo>('/me').then(response => response.data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}