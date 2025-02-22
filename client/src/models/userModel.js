import { makeAutoObservable } from "mobx";
import translations from "../translations";

class UserModel {
    email = "";
    name = "";
    password = "";
    person_id = null;
    pnr = "";
    role_id = null;
    surname = "";
    username = "";
    isLoggedIn = false;
    language = "en";
    strings = translations["en"];

    constructor() {
        makeAutoObservable(this);
    }

    setLanguage(language) {
        this.language = language;
        this.strings = translations[language];
    }

    setUserData(userData) {
        this.user_id = userData.person_id;
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
