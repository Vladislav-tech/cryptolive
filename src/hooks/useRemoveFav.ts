export const useRemoveFav = (symbol: string) => {
    try {
        const currentSymbols: string[] = JSON.parse(localStorage.getItem("symbols") || "[]");

        if (currentSymbols.includes(symbol.toLowerCase())) {
            const filtered = currentSymbols.filter(s => s !== symbol.toLowerCase());

            localStorage.setItem('symbols', JSON.stringify(filtered));
        }
    } catch (error) {
        console.error(error);
    }
}

