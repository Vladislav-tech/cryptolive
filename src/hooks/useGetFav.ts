import type { CryptoData } from "./useCryptoWebSocket";

export const useGetFav = () => {
    try {
        const favorites: string[] = JSON.parse(localStorage.getItem("symbols") || "[]");

        return favorites;
    } catch (error) {
        
    }
}