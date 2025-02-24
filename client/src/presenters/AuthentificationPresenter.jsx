import AuthentificationView from "../views/AuthentificationView.jsx";
import { observer } from "mobx-react-lite";
import React from "react";
import { useState, useEffect } from "react";

const AuthentificationPresenter = observer(({ model }) => {
    const [strings, setStrings] = useState(model.strings);
    
        useEffect(() => {
            setStrings(model.strings);
        }, [model.strings]);


    const handleLoginSuccess = (userData) => {
        model.setUserData(userData);
        window.location.href = "#/profile";
    };

    return <AuthentificationView onLoginSuccess={handleLoginSuccess} strings={strings}/>;
});

export default AuthentificationPresenter;
