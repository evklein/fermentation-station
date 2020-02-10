export const formatDate = (date: any): string => {
    if (date.seconds === undefined) {
        return new Date(date).toLocaleDateString('en-US');
    }

    return new Date(date.seconds * 1000).toLocaleDateString('en-US');
}