import RecruiterView from "../views/RecruiterView.jsx";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";

/**
 * RecruiterPresenter Component - Manages the recruiter dashboard state and localization.
 * 
 * - Observes changes in the MobX store (`model`).
 * - Updates localized strings dynamically when the model's strings change.
 * - Passes the user model and applicants model to the `RecruiterView` component.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.model - The application model containing user authentication and localization data.
 * @param {Object} props.applicantsModel - The model containing applicants' data.
 * 
 * @returns {JSX.Element} The RecruiterView component with updated localization strings and models.
 */
const RecruiterPresenter = observer(({model, applicantsModel}) => {
    
    const [strings, setStrings] = useState(model.strings);
    
    useEffect(() => {
        setStrings(model.strings);
    }, [model.strings]);
    
    return (
        <RecruiterView model={model} applicantsModel={applicantsModel} strings={strings}/>
    );
});

export default RecruiterPresenter;