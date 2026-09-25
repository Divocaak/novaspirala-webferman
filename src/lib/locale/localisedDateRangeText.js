const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
};

const optionsWithoutHours = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
};

export function getLocalisedDate(date, hours = true) {
    return new Date(date).toLocaleDateString('cs-CZ', hours ? options : optionsWithoutHours);
}