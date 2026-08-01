export class Privilege {

    id;
    label;
    note;
    text_color;
    background_color;

    constructor({
        id,
        label,
        note,
        text_color,
        background_color
    }) {
        this.id = id;
        this.label = label;
        this.note = note;
        this.text_color = text_color;
        this.background_color = background_color;
    }
}