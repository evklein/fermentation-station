const SECONDS_IN_HOUR: number = 60 * 60;
const SECONDS_IN_DAY: number = 60 * 60 * 24;
const SECONDS_IN_WEEK: number = 60 * 60 * 24 * 7;

export const SECONDS_IN_4_HOURS = 60 * 60 * 4;

export const formatDate = (date: any): string => {
    if (date.seconds === undefined) {
        return new Date(date).toLocaleDateString('en-US');
    }

    return new Date(date.seconds * 1000).toLocaleDateString('en-US');
}

export const convertUnitsToSeconds = (value: number, unit: string): number => {
    switch (unit) {
        case 'Hour(s)':
            return value * SECONDS_IN_HOUR;
        case 'Day(s)':
            return value * SECONDS_IN_DAY;
        case 'Week(s)':
            return value * SECONDS_IN_WEEK;
        default:
            return 0;
    }
}

export const convertSecondsToProperFormat = (seconds: number): { value: number, unit: string } => {
    if (seconds >= SECONDS_IN_WEEK && seconds % SECONDS_IN_WEEK === 0) {
        return {
            value: seconds / SECONDS_IN_WEEK,
            unit: 'Week(s)'
        }
    } else if (seconds >= SECONDS_IN_DAY && seconds < SECONDS_IN_WEEK && seconds % SECONDS_IN_DAY === 0) {
        return {
            value: seconds / SECONDS_IN_DAY,
            unit: 'Day(s)'
        }
    } else if (seconds >= SECONDS_IN_HOUR && seconds < SECONDS_IN_DAY && seconds % SECONDS_IN_HOUR === 0) {
        return {
            value: seconds / SECONDS_IN_HOUR,
            unit: 'Hour(s)'
        }
    } else {
        return {
            value: 0,
            unit: 'Hour(s)'
        }
    }
}