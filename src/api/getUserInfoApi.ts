import api from '@/api/axiosInstance';

interface UserInfo {
    email: string;
    name: string;
}

export const getUserInfo = async () => {
    try {
        return api.get<UserInfo>('/me');
    } catch (error) {
        console.log(error);
    }
}