import { makeAutoObservable } from "mobx";

class UserModel {
    email = "";
    name = "";
    password = "";
    person_id = null;
    pnr = "";
    role_id = 1;
    surname = "";
    username = "";
    isLoggedIn = false;

    constructor() {
        makeAutoObservable(this);
    }

    setUserData(userData) {
        this.email = userData.email;
        this.name = userData.name;
        this.password = userData.password;
        this.person_id = userData.person_id;
        this.pnr = userData.pnr;
        this.role_id = userData.role_id;
        this.surname = userData.surname;
        this.username = userData.username;
        this.isLoggedIn = true;
    }
}

export default UserModel;
