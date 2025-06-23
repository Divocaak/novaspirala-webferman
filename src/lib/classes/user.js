import { Privilege } from "$lib/classes/privilege";
import { Status } from "$lib/classes/status";
import { PUBLIC_PRIVILEGE_ID_SYS_ADMIN, PUBLIC_PRIVILEGE_ID_STRUCTURE_ADMIN, PUBLIC_PRIVILEGE_ID_BARTENDER, PUBLIC_STATUS_ID_APPROVED, PUBLIC_STATUS_ID_BANNED, PUBLIC_STATUS_ID_DELETED, PUBLIC_STATUS_ID_NEUTRAL } from "$env/static/public";

export class User {

    id;
    email;
    phone;
    fName = "";
    lName = "";
    status = null;
    privileges = [];

    constructor({ id, email, phone, fName = "", lName = "", status = null, privileges = [] }) {
        Object.assign(this, { id, email, phone, fName, lName, status, privileges });
    }

    static fromJSON(json) {
        return new User({
            id: json.id,
            email: json.email,
            fName: json.fName,
            lName: json.lName,
            phone: json.phone,
            status: new Status({
                id: json.status.id,
                label: json.status.label
            }),
            privileges: User.createPrivileges(json.privileges)
        });
    }

    setPrivileges(json) { this.privileges = User.createPrivileges(json); }

    static createPrivileges(json) { return json.map(privilege => new Privilege({ id: privilege.id, label: privilege.label, structureId: privilege.structureId, structureLabel: privilege.structureLabel })); }

    isSysAdmin() { return this.#checkForPrivilege(PUBLIC_PRIVILEGE_ID_SYS_ADMIN); }
    isStructureAdmin() { return this.#checkForPrivilege(PUBLIC_PRIVILEGE_ID_STRUCTURE_ADMIN); }
    isBartender() { return this.#checkForPrivilege(PUBLIC_PRIVILEGE_ID_BARTENDER); }
    #checkForPrivilege(privilegeId) { return this.privileges.some((privilege) => privilege.id === parseInt(privilegeId)); }

    getStructuresWhereStructureAdmin() { return this.#getStructuresWherePrivileged(PUBLIC_PRIVILEGE_ID_STRUCTURE_ADMIN)};
    getStructuresWhereBartender() { return this.#getStructuresWherePrivileged(PUBLIC_PRIVILEGE_ID_BARTENDER)};
    #getStructuresWherePrivileged(privilegeId) {
        return this.privileges
            .filter((privilege) => privilege.privilegeId === parseInt(privilegeId))
            .map(({ structureId, structureLabel }) => ({ structureId, structureLabel }));
    }

    isNeutral() { return this.#checkForStatus(PUBLIC_STATUS_ID_NEUTRAL); }
    isApproved() { return this.#checkForStatus(PUBLIC_STATUS_ID_APPROVED); }
    isBanned() { return this.#checkForStatus(PUBLIC_STATUS_ID_BANNED); }
    isDeleted() { return this.#checkForStatus(PUBLIC_STATUS_ID_DELETED); }
    #checkForStatus(statusId) { return parseInt(this.status.id) === parseInt(statusId); }

    getInfoString() { return `logged in as <b>${this.lName} ${this.fName}</b> (${this.email}, ${this.phone}, id: <i>${this.id}</i>)`; }
}