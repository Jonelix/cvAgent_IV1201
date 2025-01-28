import { makeAutoObservable } from "mobx";

class UserModel {
    loggedIn = false;
    username = "";
    firstName = "";
    lastName = "";
    personNumber = "";
    email = "";

    constructor() {
        makeAutoObservable(this);
    }

    setLoggedIn(value) {
        this.loggedIn = value;
    }
}

const userModel = new UserModel();
export default userModel;