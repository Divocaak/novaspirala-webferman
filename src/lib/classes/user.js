import { Privilege } from "$lib/classes/privilege";
import { PUBLIC_PRIVILEGE_ID_SYS_ADMIN, PUBLIC_PRIVILEGE_ID_READ, PUBLIC_PRIVILEGE_ID_WRITE } from "$env/static/public";

export class User {

    id;
    login;
    email = "";
    phone;
    fName = "";
    lName = "";
    privileges = [];

    constructor({ id, login, email = "", phone, fName = "", lName = "", privileges = [] }) {
        Object.assign(this, { id, login, email, phone, fName, lName, privileges });
    }

    static fromJSON(json) {
        return new User({
            id: json.id,
            login: json.login,
            email: json.email,
            fName: json.fName,
            lName: json.lName,
            phone: json.phone,
            privileges: User.createPrivileges(json.privileges)
        });
    }

    setPrivileges(json) { this.privileges = User.createPrivileges(json); }
    static createPrivileges(json) { return json.map(privilege => new Privilege({ id: privilege.id, label: privilege.label })); }

    isSysAdmin() { return this.#checkForPrivilege(PUBLIC_PRIVILEGE_ID_SYS_ADMIN); }
    // isAllowedToRead = can see events, has privilege to read
    isAllowedToRead() { return this.isSysAdmin() || this.#checkForPrivilege(PUBLIC_PRIVILEGE_ID_READ); }
    // isAllowedToCreate = can add and edit events, has privilege to write and edit
    isAllowedToCreate() { return this.isSysAdmin() || this.#checkForPrivilege(PUBLIC_PRIVILEGE_ID_WRITE); }
    // isAllowedToEdit = created event or is sysadmin
    isAllowedToEdit(createdById) {return this.isSysAdmin() || this.id == createdById}
    // isAllowedToDelete = created event or is sysadmin
    isAllowedToDelete(createdById) {return this.isSysAdmin() || this.id == createdById}
    #checkForPrivilege(privilegeId) { return this.privileges.some((privilege) => privilege.id === parseInt(privilegeId)); }

    getInfoString() { return `Přihlášen jako <b>${this.lName} ${this.fName}</b> (${this.email}, ${this.phone}, id: <i>${this.id}</i>)`; }
}