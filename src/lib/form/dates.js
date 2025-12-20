export const toDateInputValue = (dateStr) =>
	dateStr ? dateStr.replace(' ', 'T').slice(0, 16) : '';

export const formatForMySQL = (dateStr) =>
	dateStr ? `${dateStr.replace('T', ' ')}:00` : null;

export const createEmptyRange = () => ({
	uid: crypto.randomUUID(),
	from: '',
	to: ''
});