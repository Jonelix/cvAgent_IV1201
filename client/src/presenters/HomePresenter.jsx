import HomeView from "../views/HomeView.jsx";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";

/**
 * HomePresenter Component - Manages the state and localization for the home view.
 * 
 * - Observes changes in the MobX store (`model`).
 * - Updates the localized strings dynamically when the model's strings change.
 * - Passes the updated localization strings and model data to the `HomeView` component.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.model - The application model containing localization data.
 * 
 * @returns {JSX.Element} The HomeView component with updated localization strings.
 */
const HomePresenter = observer(({ model }) => {
    const [strings, setStrings] = useState(model.strings);

    useEffect(() => {
        setStrings(model.strings);
    }, [model.strings]);
    

    return (
        <HomeView model={model} strings={strings}/>
    );
});

export default HomePresenter;