import AuthentificationView from "../views/AuthentificationView.jsx";
import { observer } from "mobx-react-lite";
import React from "react";

const AuthentificationPresenter = observer(({ model }) => {
    const handleLoginSuccess = (userData) => {
        model.setUserData(userData);

        const { cookie } = userData;
        if(cookie) {
          model.setCookie(cookie);
        } else {
          console.log("no cookie detected");
        }

        window.location.href = "#/profile";
    };


    return <AuthentificationView onLoginSuccess={handleLoginSuccess} />;
});

export default AuthentificationPresenter;
