export interface IUser {
    name: string;
    surname: string;
}
class User {
    user: IUser;
    constructor(user: IUser) {
        this.user = user;
    }

    getUser() {
        return this.user;
    }

    validationName() {
        return this.validationToUpper(this.getUser().name) && this.getUser().name.length >= 3;
    }

    validationSurname() {
        return this.validationToUpper(this.getUser().surname) && this.getUser().surname.length >= 4;
    }

    private validationToUpper(field: string): boolean {
        return /^\p{Lu}/u.test(field) && /^[a-zA-Z\-]+$/.test(field);
    }
}

export default User;
