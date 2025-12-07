import { Privilege } from "$lib/classes/privilege";
import { Role } from "$lib/classes/role";
import { PUBLIC_PRIVILEGE_ID_SYS_ADMIN, PUBLIC_PRIVILEGE_ID_READ, PUBLIC_PRIVILEGE_ID_WRITE, PUBLIC_PRIVILEGE_ID_BOOKING } from "$env/static/public";

export class User {

    id;
    login;
    email = "";
    phone;
    fName = "";
    lName = "";
    privileges = [];
    roles = [];
    hasManagingRole = false;

    constructor({ id, login, email = "", phone, fName = "", lName = "", privileges = [], roles = [], hasManagingRole = false }) {
        Object.assign(this, { id, login, email, phone, fName, lName, privileges, roles, hasManagingRole });
    }

    static fromJSON(json) {
        return new User({
            id: json.id,
            login: json.login,
            email: json.email,
            fName: json.fName,
            lName: json.lName,
            phone: json.phone,
            privileges: User.createPrivileges(json.privileges),
            roles: User.createRoles(json.roles),
            hasManagingRole: User.hasManagingRole(json.roles)
        });
    }

    setPrivileges(json) { this.privileges = User.createPrivileges(json); }
    static createPrivileges(json) { return json.map(privilege => new Privilege({ id: privilege.id, label: privilege.label })); }

    setRoles(json) { this.roles = User.createRoles(json); }
    static createRoles(json) { return json.map(role => new Role({ id: role.id, label: role.label, manager: role.manager })); }
    static hasManagingRole(json) { return json.some(r => r.manager); }
    /* static */

    isSysAdmin() { return this.#checkForPrivilege(PUBLIC_PRIVILEGE_ID_SYS_ADMIN); }
    // isAllowedToRead = can see events, has privilege to read
    isAllowedToRead() { return this.isSysAdmin() || this.#checkForPrivilege(PUBLIC_PRIVILEGE_ID_READ); }
    // isAllowedToBook = allows users to book their shifts in advance
    isAllowedToBook(pastBookable) { return this.isSysAdmin() || this.#checkForPrivilege(PUBLIC_PRIVILEGE_ID_BOOKING) && pastBookable; }
    // isAllowedToCreate = can add and edit events, has privilege to write and edit
    isAllowedToCreate() { return this.isSysAdmin() || this.#checkForPrivilege(PUBLIC_PRIVILEGE_ID_WRITE); }
    // isAllowedToEdit = created event or is sysadmin or manages at least one role
    // used when accessing edit form
    isAllowedToEdit(createdById, pastEditable) { return this.isAllowedToEditFull(createdById) || this.hasManagingRole && pastEditable }
    // isAllowedToEdit = created event or is sysadmin
    // used for determining if input field should be readonly or not
    isAllowedToEditFull(createdById, pastEditable) { return this.isSysAdmin() || this.id == createdById && pastEditable }
    // isAllowedToEditDescription = sysadmin, any roles manager, created this event
    // used for all roles managers to be allowed to edit description
    isAllowedToEditDescription(createdById) { return this.isSysAdmin() || this.hasManagingRole || this.id == createdById }
    // isRolesManager = can user manage people for this role
    // used for determining if input field should be readonly or not
    isRolesManager(createdById, roleId) { return this.isAllowedToEditFull(createdById) || this.#checkForRole(roleId); }
    // isAllowedToDelete = created event or is sysadmin
    isAllowedToDelete(createdById, pastEditable) { return this.isSysAdmin() || this.id == createdById && pastEditable }

    #checkForPrivilege(privilegeId) { return this.privileges.some((privilege) => privilege.id === parseInt(privilegeId)); }
    #checkForRole(roleId) {
        const role = this.roles.find(r => r.id === roleId);
        return role ? role.manager === 1 : false;
    }

    getInfoString() { return `Přihlášen jako <b>${this.lName} ${this.fName}</b> (${this.email}, ${this.phone}, id: <i>${this.id}</i>)`; }
}