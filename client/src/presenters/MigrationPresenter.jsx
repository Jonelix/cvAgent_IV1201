import MigrationView from "../views/MigrationView.jsx";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";

/**
 * MigrationPresenter Component - Manages the migration and password reset process.
 * 
 * - Observes changes in the MobX store (`model`).
 * - Updates localized strings dynamically when the model's strings change.
 * - Handles successful login post-migration by updating user data and redirecting to the profile page.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.model - The application model containing user authentication and localization data.
 * 
 * @returns {JSX.Element} The MigrationView component with updated localization strings and login handling.
 */
const MigrationPresenter = observer(({ model }) => {
    const [strings, setStrings] = useState(model.strings);

    useEffect(() => {
        setStrings(model.strings);
    }, [model.strings]);

    /**
     * Handles successful login post-migration by updating the user model and redirecting to the profile page.
     * 
     * @param {Object} userData - The user data returned from the authentication process.
     */
    const handleLoginSuccess = (userData) => {
        model.setUserData(userData);
        window.location.href = "#/profile";
    };
    

    return (
        <MigrationView model={model} strings={strings} onLoginSuccess={handleLoginSuccess}/>
    );
});

export default MigrationPresenter;