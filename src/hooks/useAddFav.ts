export const useAddFav = (symbol: string): void => {
    try {
        const prevSymbols: string[] = JSON.parse(localStorage.getItem("symbols") || "[]");

        if (prevSymbols.includes(symbol.toLowerCase())) return;

        const serialized = JSON.stringify([symbol.toLowerCase(), ...prevSymbols]);
        localStorage.setItem('symbols', serialized);
    } catch (error) {
        console.error(error);
    }
};
