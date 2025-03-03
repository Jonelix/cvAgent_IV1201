import MigrationView from "../views/MigrationView.jsx";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";

const MigrationPresenter = observer(({ model }) => {
    const [strings, setStrings] = useState(model.strings);

    useEffect(() => {
        setStrings(model.strings);
    }, [model.strings]);

    const handleLoginSuccess = (userData) => {
        model.setUserData(userData);
        window.location.href = "#/profile";
    };
    

    return (
        <MigrationView model={model} strings={strings} onLoginSuccess={handleLoginSuccess}/>
    );
});

export default MigrationPresenter;