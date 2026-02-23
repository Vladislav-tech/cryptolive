import api from '@/api/axiosInstance';

export const getFavorites = async () => {
    try {
        return api.get<{ favorites: string[] }>('/favorites');
    } catch (error) {
        throw error;
    }

}

export const addFavorite = async (ticker: string) => {
    try {
        await api.post('/favorites/add', { ticker: ticker.toLowerCase() });
    } catch (error: any) {
        if (error?.status === 401) {
            throw new Error('You must sign in to add favorite')
        } else {
            throw error;

        }
    }
}

export const removeFavorite = async (ticker: string) => {
    try {
        await api.delete('/favorites/remove', {
            data: {
                ticker: ticker.toLowerCase(),
            },
        });
    } catch (error: any) {
        if (error?.status === 401) {
            throw new Error('You must sign in to remove favorite')
        } else {
            throw error;
        }
    }
}