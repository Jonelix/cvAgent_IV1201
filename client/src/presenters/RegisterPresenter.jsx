
import RegisterView from '../views/RegisterView';
import { observer } from 'mobx-react-lite';
import { useState, useEffect } from "react";

/**
 * RegisterPresenter Component - Manages the state and localization for the registration view.
 * 
 * - Observes changes in the MobX store (`model`).
 * - Updates localized strings dynamically when the model's strings change.
 * - Passes the updated localization strings and model data to the `RegisterView` component.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.model - The application model containing localization data.
 * 
 * @returns {JSX.Element} The RegisterView component with updated localization strings.
 */
const RegisterPresenter = observer(({model}) => {
    const [strings, setStrings] = useState(model.strings);

    useEffect(() => {
        setStrings(model.strings);
    }, [model.strings]);

    return (
        <RegisterView model={model} strings={strings}/>
    );
});

export default RegisterPresenter;