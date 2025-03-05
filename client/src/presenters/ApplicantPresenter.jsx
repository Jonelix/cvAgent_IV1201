import ApplicantView from "../views/ApplicantView.jsx";
import { observer } from "mobx-react-lite";
import React from "react";
import { useState, useEffect } from "react";

/**
 * ApplicantPresenter Component - Manages state and data for the ApplicantView.
 * 
 * - Observes changes in the MobX store (`model`).
 * - Updates the localized strings dynamically when the model's strings change.
 * - Passes the updated model and localization strings to the `ApplicantView` component.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.model - The application model containing user and localization data.
 * 
 * @returns {JSX.Element} The ApplicantView component with updated model and strings.
 */
const ApplicantPresenter = observer(({ model }) => { 

    const [strings, setStrings] = useState(model.strings);
    
        useEffect(() => {
            setStrings(model.strings);
        }, [model.strings]);
    
    return <ApplicantView model={model} strings={strings}/>; 
});


export default ApplicantPresenter;