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
    } catch (error) {
        throw error;
    }
}

export const removeFavorite = async (ticker: string) => {
    try {
        await api.delete('/favorites/remove', {
            data: {
                ticker: ticker.toLowerCase(),
            },
        });
    } catch (error) {
        throw error;
    }
}