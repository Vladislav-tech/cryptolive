import { addFavorite, removeFavorite } from "@/api/favoritesApi";
import { FAVORITES_QUERY_KEY } from "@/utils/queryKeys";
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { toast } from "sonner";

export const useFavoriteToggle = (
    ticker: string,
    isFav: boolean,
    onSuccessFn?: () => void
) => {
    const queryClient = useQueryClient();
    const symbolName = ticker.replace('usdt', '');

    return useMutation({
        mutationFn: async () => {
            if (isFav) await removeFavorite(ticker);
            else await addFavorite(ticker);
            return !isFav;
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });
            const previous = queryClient.getQueryData(FAVORITES_QUERY_KEY);

            queryClient.setQueryData(FAVORITES_QUERY_KEY, (old: any) => {
                if (!old?.data?.favorites) return old;
                return {
                    data: {
                        favorites: isFav
                            ? old.data.favorites.filter((s: string) => s !== ticker)
                            : [...old.data.favorites, ticker]
                    }
                };
            });

            return { previous };
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(FAVORITES_QUERY_KEY, context?.previous);
            toast.error('Failed to update favorites');
        },
        onSuccess: (newIsFav) => {
            if (newIsFav) {
                toast.success('Added to favorites', {
                    description: `${symbolName.toUpperCase()} now is on your favorites list`,
                    duration: 4000,
                    ...(onSuccessFn && {
                        action: {
                            label: 'Open',
                            onClick: onSuccessFn
                        }
                    })
                });
            } else {
                toast.success('Removed from favorites', {
                    description: `${symbolName.toUpperCase()} has been removed from favorites`,
                    duration: 3000
                });
            }
        }
    });
};
