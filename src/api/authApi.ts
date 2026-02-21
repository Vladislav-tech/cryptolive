import api from "@/api/axiosInstance";
import type { IUserData } from "@/types/IUserData";
import type { AuthResponse } from "@/types/response/AuthResponse";
import type { AxiosResponse } from "axios";

export const registerUser = async (data: IUserData): Promise<AxiosResponse<AuthResponse>> => {
    const response = api.post('/registration', data);
    return response;
}

export const login = async (data: IUserData): Promise<AxiosResponse<AuthResponse>> => {
    try {
        const response = await api.post('/login', data);
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }

}

export const logout = async () => {
    await api.post('/logout');
    localStorage.removeItem('token');
}

export const checkAuth = async (): Promise<boolean> => {
    try {
        const response = await api.get<AuthResponse>('/refresh');
        if (response?.data?.accessToken) {
            localStorage.setItem('token', response.data.accessToken);
            return true;
        }
        localStorage.removeItem('token');
        return false;
    } catch (error) {
        localStorage.removeItem('token');
        return false;
    }
}