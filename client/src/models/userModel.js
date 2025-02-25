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

    /* Saving authentication cookie from server */
    cookie = "";

    constructor() {
        makeAutoObservable(this);
        console.log("checking cookie");
        this.checkCookieOnLoad();
    }

    setCookie(cookie){
      this.cookie = cookie;
      document.cookie = `authCookie=${cookie}; path=/;`;
      console.log("recived cookie: " + cookie)
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
        this.role_id = 1; //userData.role_id;
        this.surname = userData.surname;
        this.username = userData.username;
        this.isLoggedIn = true;
    }

    checkCookieOnLoad(){
      if(document.cookie != null){
        console.log("cookie found on load: " + document.cookie);
        this.autoLogin(document.cookie);
      }

    }

    async autoLogin(cookie){
      //MAKE CALL TO LOGIN COOKIE API
      console.log("sending to api/login");
        try {
            const response = await fetch("http://localhost:5005/api/login", {
            //const response = await fetch("http://localhost:5005/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include', // This is necessary to send cookies
                body: JSON.stringify({ cookie }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            }

            console.log("Response:", data);
            this.setUserData(data);
            return data;
        } catch (error) {
            console.error("Error:", error.message);
            return { error: error.message };
        }
    }
}



export default UserModel;
