import type { CoinDataType } from "@/types";

export const findMinPrice = (data: CoinDataType[]): number | undefined => {
    if (!data || data.length === 0) {
        return undefined;
    }

    return data.reduce((min, item) => {
        if (item.price !== undefined && item.price < min) {
            return item.price;
        }
        return min;
    }, data[0]?.price ?? Infinity);
}