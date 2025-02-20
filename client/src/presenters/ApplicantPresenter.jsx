import ApplicantView from "../views/ApplicantView.jsx";
import { observer } from "mobx-react-lite";
import React from "react";

const ApplicantPresenter = observer(({ model }) => { 
    return <ApplicantView model={model} />; 
});


export default ApplicantPresenter;