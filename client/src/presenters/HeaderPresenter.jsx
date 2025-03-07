import HeaderView from "../views/HeaderView.jsx";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";

/**
 * HeaderPresenter Component - Manages the state and localization for the header.
 * 
 * - Observes changes in the MobX store (`model`).
 * - Updates the localized strings dynamically when the model's strings change.
 * - Passes the updated localization strings and authentication state to the `HeaderView` component.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.model - The application model containing user authentication and localization data.
 * 
 * @returns {JSX.Element} The HeaderView component with updated localization strings and authentication state.
 */
const HeaderPresenter = observer(({ model }) => {
    const [strings, setStrings] = useState(model.strings);
    
    useEffect(() => {
        setStrings(model.strings);
    }, [model.strings]);

    return <HeaderView model={model} isLoggedIn={model.isLoggedIn} strings={strings} />;
});

export default HeaderPresenter;