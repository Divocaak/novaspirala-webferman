import { Privilege } from "$lib/classes/privilege";
import { Role } from "$lib/classes/role";
import { PUBLIC_PRIVILEGE_ID_SYS_ADMIN, PUBLIC_PRIVILEGE_ID_READ, PUBLIC_PRIVILEGE_ID_WRITE, PUBLIC_PRIVILEGE_ID_BOOKING, PUBLIC_PRIVILEGE_ID_COMMENTS } from "$env/static/public";

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

    /*
    # FORM RULES
    ## CREATE
    - sysadmin
        - access to everything
    - CreateEvents privilege
        - if doesnt have RolesManager, check people
    - RolesManager privilege
        - can fill everything, except Roles where he doesnt have managers privilige 
    
    ## EDIT
    - my event (I am the one, who created it)
        - edit everything in HEAD
    - sysadmin
        - access to everything
    - CreateEvents privilege
        - edit only description (if not original author of event)
    - RolesManager privilege
        - his Roles assigned people
        - description
    */

    isSysAdmin() { return this.#checkForPrivilege(PUBLIC_PRIVILEGE_ID_SYS_ADMIN); }
    // isAllowedToRead = can see events, has privilege to read
    isAllowedToRead() { return this.isSysAdmin() || this.#checkForPrivilege(PUBLIC_PRIVILEGE_ID_READ); }
    // isAllowedToBook = allows users to book their shifts in advance
    isAllowedToBook(pastBookable) { return this.isSysAdmin() || this.#checkForPrivilege(PUBLIC_PRIVILEGE_ID_BOOKING) && pastBookable; }

    // isAllowedToDelete = created event or is sysadmin
    isAllowedToDelete(createdById, pastEditable) { return this.isSysAdmin() || this.id == createdById && pastEditable }

    // isAllowedToCreate = has privilege add/edit events
    // allows user to edit information only in the HEAD of the form (both in edit/create state)
    // used ONLY when accessing form
    isAllowedToCreate() { return this.isSysAdmin() || this.#checkForPrivilege(PUBLIC_PRIVILEGE_ID_WRITE); }

    // isAllowedToEdit = created event or is sysadmin or manages at least one role
    // used ONLY when accessing form
    isAllowedToEdit() { return this.isAllowedToCreate() || this.hasManagingRole }

    isAllowedToEditHeadField(isEditing, pastEditable, createdById) {
        if (this.isSysAdmin()) return true;

        if (isEditing) {
            if (pastEditable) return false;

            // original author can edit whole head
            return (this.id == createdById);
        }

        // CREATE state
        return this.#checkForPrivilege(PUBLIC_PRIVILEGE_ID_WRITE);
    }

    isAllowedToEditDescriptionField(isEditing, pastEditable, createdById) {
        if (this.isSysAdmin()) return true;

        if (isEditing) {
            if (pastEditable) return false;

            // author can edit description
            if (this.id == createdById) return true;

            // RoleManager can edit description
            return this.hasManagingRole;
        }

        // CREATE state
        if (this.#checkForPrivilege(PUBLIC_PRIVILEGE_ID_WRITE)) return true;
        return this.hasManagingRole;
    }

    // isRolesManager = can user manage people for this role
    // used for determining if input field should be readonly or not
    isRolesManager(roleId) { return this.isSysAdmin() || this.#checkForRole(roleId); }

    //isAllowedToComment = enable/disable comments to sections in event form
    isAllowedToComment() { return this.isSysAdmin() || this.#checkForPrivilege(PUBLIC_PRIVILEGE_ID_COMMENTS); }

    #checkForPrivilege(privilegeId) { return this.privileges.some((privilege) => privilege.id === parseInt(privilegeId)); }
    #checkForRole(roleId) {
        const role = this.roles.find(r => r.id === roleId);
        return role ? role.manager === 1 : false;
    }

    getInfoString() { return `Přihlášen jako <b>${this.lName} ${this.fName}</b> (${this.email}, ${this.phone}, id: <i>${this.id}</i>)`; }
}