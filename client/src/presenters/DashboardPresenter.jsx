import React from "react";
import { observer } from "mobx-react-lite";
import RecruiterPresenter from "./RecruiterPresenter.jsx";
import ApplicantPresenter from "./ApplicantPresenter.jsx";

const DashboardPresenter = observer(({ model, applicantsModel }) => {
    if (!model.isLoggedIn) {
        window.location.href = "#/auth";
    }
    return (model.role_id == 1 ? <RecruiterPresenter model={model} applicantsModel={applicantsModel}/> : <ApplicantPresenter model={model}/> );
});

export default DashboardPresenter;