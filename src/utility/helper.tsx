const SECONDS_IN_HOUR: number = 60 * 60;
const SECONDS_IN_DAY: number = 60 * 60 * 24;
const SECONDS_IN_WEEK: number = 60 * 60 * 24 * 7;

export const SECONDS_IN_4_HOURS = 60 * 60 * 4;

export const compareObjectNames = (first: firebase.firestore.DocumentData, second: firebase.firestore.DocumentData): number => {
    let firstName = first.name.toUpperCase();
    let secondName = second.name.toUpperCase();

    if (firstName < secondName) return -1;
    else if (firstName > secondName) return 1;
    else return 0;
}

export const formatDate = (date: any): string => {
    if (date.seconds === undefined) {
        return new Date(date).toLocaleDateString();
    }

    return new Date(date.seconds * 1000).toLocaleDateString();
}

export const formatDateAsISO = (date: any): string => {
    if (date.seconds === undefined) {
        return new Date(date).toISOString().substr(0, 10);
    }

    return new Date(date.seconds * 1000).toISOString().substr(0, 10);
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

export const splitIngredientsIntoList = (ingredientsString: string) => {
    if (ingredientsString) {
        let splitArray = ingredientsString.split(':::');
        return splitArray.slice(0, splitArray.length - 1);
    }

    return [];
}