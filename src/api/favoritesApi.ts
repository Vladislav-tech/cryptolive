import api from '@/api/axiosInstance';

export const getFavorites = async () => {
    return api.get<string[]>('/favorites');
}

export const addFavorite = async (ticker: string) => {
    try {
        await api.post('/favorites/add', { ticker: ticker.toLowerCase() });
    } catch (error) {
        console.log(error);
    }
}

export const removeFavorite = async (ticker: string) => {
    try {
        await api.delete('favorites/remove', {
            data: {
                ticker: ticker.toLowerCase(),
            },
        });
    } catch (error) {
        console.log(error);
    }
}