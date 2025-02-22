import ProfileView from "../views/ProfileView.jsx";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";

const ProfilePresenter = observer(({ model }) => {
    const [strings, setStrings] = useState(model.strings);
    
        useEffect(() => {
            setStrings(model.strings);
        }, [model.strings]);
    return <ProfileView model={model} strings={strings} />;
});

export default ProfilePresenter;
