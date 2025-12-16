export const findInSelect = (dataset, id) => {
    if (!id) return null;
    return dataset[dataset.findIndex((element) => element.id === parseInt(id))] ?? null;
} 