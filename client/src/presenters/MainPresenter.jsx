import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePresenter from "./HomePresenter.jsx";
import ProfilePresenter from "./ProfilePresenter.jsx";
import AuthentificationPresenter from "./AuthentificationPresenter.jsx";
import RegisterPresenter from "../presenters/RegisterPresenter.jsx";
import DashboardPresenter from "./DashboardPresenter.jsx";
import MigrationPresenter from "./MigrationPresenter.jsx";

/**
 * MainPresenter Component - Manages the routing structure of the application.
 * 
 * - Observes changes in the MobX store (`model`).
 * - Provides routes to different pages including Home, Profile, Authentication, Registration, Dashboard, and Reset.
 * - Passes the appropriate model and applicantsModel to respective presenters.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.model - The application model containing user and localization data.
 * @param {Object} props.applicantsModel - The model containing applicants data (used in Dashboard and Migration pages).
 * 
 * @returns {JSX.Element} The main routing structure of the application.
 */
const MainPresenter = observer(({ model, applicantsModel }) => {

    return (
        <div className="flex flex-grow items-center justify-center">
            <Routes>
                <Route path="/" element={<HomePresenter model={model} />} />
                <Route path="/profile" element={<ProfilePresenter model={model}/>} />
                <Route path="/auth" element={<AuthentificationPresenter model={model}/>} />
                <Route path="/registration" element={<RegisterPresenter model={model}/>} />
                <Route path="/dashboard" element={<DashboardPresenter model={model} applicantsModel={applicantsModel}/>} />
                <Route path="/reset" element={<MigrationPresenter model={model} applicantsModel={applicantsModel}/>} />d
            </Routes>
        </div>
    );
});

export default MainPresenter;