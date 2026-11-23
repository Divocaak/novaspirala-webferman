export class Role {

    id;
    label;
    manager;
    note;
    text_color;
    background_color;

    constructor({
        id,
        label,
        manager,
        note,
        text_color,
        background_color,
    }) {
        this.id = id;
        this.label = label;
        this.manager = manager;
        this.note = note;
        this.text_color = text_color;
        this.background_color = background_color;
    }
}