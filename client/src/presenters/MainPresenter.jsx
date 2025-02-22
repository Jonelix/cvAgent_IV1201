import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePresenter from "./HomePresenter.jsx";
import ProfilePresenter from "./ProfilePresenter.jsx";
import AuthentificationPresenter from "./AuthentificationPresenter.jsx";
import RegisterPresenter from "../presenters/RegisterPresenter.jsx";
import DashboardPresenter from "./DashboardPresenter.jsx";

const MainPresenter = observer(({ model, applicantsModel }) => {

    return (
        <div className="flex flex-grow items-center justify-center">
            <Routes>
                <Route path="/" element={<HomePresenter model={model} />} />
                <Route path="/profile" element={<ProfilePresenter model={model}/>} />
                <Route path="/auth" element={<AuthentificationPresenter model={model}/>} />
                <Route path="/registration" element={<RegisterPresenter model={model}/>} />
                <Route path="/dashboard" element={<DashboardPresenter model={model} applicantsModel={applicantsModel}/>} />
            </Routes>
        </div>
    );
});

export default MainPresenter;