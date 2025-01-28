import { makeAutoObservable } from "mobx";

class UserModel {
    userEmail = "";
    loggedIn = false;
    text = "Player name";

    constructor() {
        makeAutoObservable(this);
    }

    setLoggedIn() {
        this.loggedIn = true;
    }

    setText(input) {
        this.text = input;
    }
}

const userModel = new UserModel();
export default userModel;