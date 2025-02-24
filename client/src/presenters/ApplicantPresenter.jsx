import ApplicantView from "../views/ApplicantView.jsx";
import { observer } from "mobx-react-lite";
import React from "react";
import { useState, useEffect } from "react";

const ApplicantPresenter = observer(({ model }) => { 

    const [strings, setStrings] = useState(model.strings);
    
        useEffect(() => {
            setStrings(model.strings);
        }, [model.strings]);
    
    return <ApplicantView model={model} strings={strings}/>; 
});


export default ApplicantPresenter;