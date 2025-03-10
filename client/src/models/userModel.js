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
        this.role_id = userData.role_id;
        this.surname = userData.surname;
        this.username = userData.username;
        this.isLoggedIn = true;
    }

    checkCookieOnLoad(){
      if(document.cookie != null){
        const jwt = document.cookie.split('authCookie=')[1];
        const isExpired = this.isJWTExpired(jwt)
        if(isExpired){
          console.log("cookie is expired");
          document.cookie = "authCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          return;
        }
        console.log("cookie found on load: " + jwt);
        this.autoLogin(document.cookie);
        return
      }
      console.log("no cookie found");
    }

     isJWTExpired(token) {
      try {
        // Split the JWT into its parts (header, payload, signature)
        const payloadBase64 = token.split('.')[1];
        // Decode the base64 payload
        const payload = JSON.parse(atob(payloadBase64));
        // Get the current time in seconds
        const currentTime = Math.floor(Date.now() / 1000);
        // Check if the token has expired
        return payload.exp < currentTime;
      } catch (e) {
        console.error("Error decoding JWT:", e);
        return true; // Assume the token is invalid/expired if there's an error
      }
    }

    async autoLogin(cookie){
      //MAKE CALL TO LOGIN COOKIE API
      console.log("sending to api/login");
        try {
            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/login", {
            //const response = await fetch("http://localhost:5005/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ cookie }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            }

            console.log("Response:", data);
            this.setUserData(data.user);
            console.log(this);
            return data;
        } catch (error) {
            console.error("Error:", error.message);
            return { error: error.message };
        }
    }

    async logOut(){
      this.user_id = null;
      this.email = "";
      this.name = "";
      this.password = "";
      this.person_id = "";
      this.pnr = "";
      this.role_id = null;
      this.surname = "";
      this.username = "";
      this.isLoggedIn = false;
      this.cookie = ""
      document.cookie = "authCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    }

}



export default UserModel;
