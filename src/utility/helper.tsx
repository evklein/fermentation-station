export const formatDate = (date: any): string => {
    if (date.seconds === undefined) {
        return new Date(date).toLocaleDateString('en-US');
    }

    return new Date(date.seconds * 1000).toLocaleDateString('en-US');
}

export const convertUnitsToSeconds = (value: number, unit: string): number => {
    switch (unit) {
        case 'Hour(s)':
            return value * 60 * 60;
        case 'Day(s)':
            return value * 24 * 60 * 60;
        case 'Week(s)':
            return value * 7 * 24 * 60 * 60;
        default:
            return 0;
    }
}

export const convertSecondsToProperFormat = (seconds: number): string => {
    return ''
}