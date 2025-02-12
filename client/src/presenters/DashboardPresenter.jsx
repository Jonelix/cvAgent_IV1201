import React from "react";
import { observer } from "mobx-react-lite";
import RecruiterPresenter from "./RecruiterPresenter.jsx";
import ApplicantPresenter from "./ApplicantPresenter.jsx";

const DashboardPresenter = observer(({ model }) => {
    return (model.isLoggedIn ? <RecruiterPresenter model={model}/> : <ApplicantPresenter model={model}/> );
});

export default DashboardPresenter;