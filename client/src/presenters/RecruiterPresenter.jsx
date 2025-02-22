import RecruiterView from "../views/RecruiterView.jsx";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";

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