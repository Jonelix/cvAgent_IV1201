import React from "react";
import { observer } from "mobx-react-lite";
import RecruiterPresenter from "./RecruiterPresenter.jsx";
import ApplicantPresenter from "./ApplicantPresenter.jsx";

/**
 * DashboardPresenter Component - Manages the dashboard view based on the user's role.
 * 
 * - Redirects unauthorized users to the authentication page.
 * - Displays the `RecruiterPresenter` if the user has a recruiter role (role_id = 1).
 * - Displays the `ApplicantPresenter` for all other users.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.model - The application model containing user authentication and role data.
 * @param {Object} props.applicantsModel - The model containing applicants data (used for recruiters).
 * 
 * @returns {JSX.Element} Either `RecruiterPresenter` or `ApplicantPresenter` based on user role.
 */
const DashboardPresenter = observer(({ model, applicantsModel }) => {
    if (!model.isLoggedIn) {
        window.location.href = "#/auth";
    }
    return (model.role_id == 1 ? <RecruiterPresenter model={model} applicantsModel={applicantsModel}/> : <ApplicantPresenter model={model}/> );
});

export default DashboardPresenter;