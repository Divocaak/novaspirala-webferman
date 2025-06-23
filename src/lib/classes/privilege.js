export class Privilege {

    id;
    label;
    /* NOTE structure obj */
    structureId;
    structureLabel;

    constructor({
        id,
        label,
        structureId,
        structureLabel
    }) {
        this.id = id;
        this.label = label;
        this.structureId = structureId;
        this.structureLabel = structureLabel
    }
}