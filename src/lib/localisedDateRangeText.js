const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
};

export function getLocalisedDate(date) {
    return new Date(date).toLocaleDateString('cs-CZ', options);
}