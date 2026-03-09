type LocaleType = Intl.LocalesArgument;

interface IFormatDate {
    dateToFormat: string | number;
    local?: LocaleType;
    shortType?: DateType;
}

type DateType = 'very-short' | 'short' | 'detailed'

export const formatDate = ({ dateToFormat, local = 'en-US', shortType = 'short' }: IFormatDate): string => {
    if (!dateToFormat) return '';

    const date = new Date(dateToFormat);

    const options: Intl.DateTimeFormatOptions = {};

    switch(shortType) {
        case 'very-short':
            options.day = '2-digit';
            options.month = '2-digit';
            options.year = 'numeric';
            break;
            
        case 'short':
            options.day = '2-digit';
            options.month = 'long';
            options.year = 'numeric';
            break;
            
        case 'detailed':
            options.day = '2-digit';
            options.month = '2-digit';
            options.year = 'numeric';
            options.hour = '2-digit';
            options.minute = '2-digit';
            options.second = '2-digit';
            options.hour12 = false;
            break;
            
        default:
            options.day = '2-digit';
            options.month = 'long';
            options.year = 'numeric';
    }

    return new Intl.DateTimeFormat(local, options).format(date);
}