import ProfileView from "../views/ProfileView.jsx";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";

const ProfilePresenter = observer(({ model }) => {
    const [strings, setStrings] = useState(model.strings);
    
        useEffect(() => {
            setStrings(model.strings);
        }, [model.strings]);

        const handleLoginSuccess = (userData) => {
            model.setUserData(userData);
            window.location.href = "#/profile";
        };
    return <ProfileView model={model} strings={strings} onLoginSuccess={handleLoginSuccess} />;
});

export default ProfilePresenter;
