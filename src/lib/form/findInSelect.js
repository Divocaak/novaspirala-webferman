export const findInSelect = (dataset, id, compareStrings = false) => {
    if (!id) return null;
    return dataset[dataset.findIndex((element) => element.id === (compareStrings ? id : parseInt(id)))] ?? null;
} 