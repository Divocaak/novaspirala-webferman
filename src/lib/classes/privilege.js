export class Privilege {

    id;
    label;
    note;

    constructor({
        id,
        label,
        note
    }) {
        this.id = id;
        this.label = label;
        this.note = note;
    }
}