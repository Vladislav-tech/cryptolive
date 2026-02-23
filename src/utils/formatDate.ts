type LocaleType = Intl.LocalesArgument;

interface IFormatDate {
    dateString: string;
    local?: LocaleType;
    shortType?: boolean;
}

export const formatDate = ({ dateString, local = 'en-US', shortType = true }: IFormatDate): string => {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = shortType
        ? {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }
        : {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour12: false
        };

    return new Intl.DateTimeFormat(local, options).format(date);
}