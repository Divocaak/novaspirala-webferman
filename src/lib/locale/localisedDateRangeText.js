const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
};

export function getLocalisedDate(date) {
    return new Date(date).toLocaleDateString('cs-CZ', options);
}