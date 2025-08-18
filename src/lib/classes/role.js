export class Role {

    id;
    label;
    manager;

    constructor({
        id,
        label,
        manager
    }) {
        this.id = id;
        this.label = label;
        this.manager = manager;
    }
}