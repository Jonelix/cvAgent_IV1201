import FooterView from "../views/FooterView.jsx";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";

/**
 * FooterPresenter Component - Manages the state and localization for the footer.
 * 
 * - Observes changes in the MobX store (`model`).
 * - Updates the localized strings dynamically when the model's strings change.
 * - Passes the updated localization strings to the `FooterView` component.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.model - The application model containing localization data.
 * 
 * @returns {JSX.Element} The FooterView component with updated localization strings.
 */
const FooterPresenter = observer(({model}) => {
    const [strings, setStrings] = useState(model.strings);
    
        useEffect(() => {
            setStrings(model.strings);
        }, [model.strings]);

    return <FooterView strings={strings}/>;
});

export default FooterPresenter;