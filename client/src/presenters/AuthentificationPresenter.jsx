import AuthentificationView from "../views/AuthentificationView.jsx";
import { observer } from "mobx-react-lite";
import React from "react";
import { useState, useEffect } from "react";

/**
 * AuthentificationPresenter Component - Manages authentication state and passes data to the AuthentificationView.
 * 
 * - Observes changes in the MobX store (`model`).
 * - Updates the localized strings dynamically when the model's strings change.
 * - Handles login success by setting user data and cookies in the model.
 * - Redirects the user to the profile page upon successful login.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.model - The application model containing user and localization data.
 * 
 * @returns {JSX.Element} The AuthentificationView component with login handling.
 */
const AuthentificationPresenter = observer(({ model }) => {
    const [strings, setStrings] = useState(model.strings);

        useEffect(() => {
            setStrings(model.strings);
        }, [model.strings]);

    /**
     * Handles successful login by updating user data and cookies.
     * 
     * @param {Object} userData - The user data returned from the authentication process.
     */
    const handleLoginSuccess = (userData) => {
      model.setUserData(userData.user);
        const { cookie } = userData;
        if(cookie) {
          model.setCookie(cookie);
          // model.setUserData(userData);
        } else {
          console.log("no cookie detected");
        }

        window.location.href = "#/profile";
    };

    return <AuthentificationView onLoginSuccess={handleLoginSuccess} strings={strings}/>;
});

export default AuthentificationPresenter;
