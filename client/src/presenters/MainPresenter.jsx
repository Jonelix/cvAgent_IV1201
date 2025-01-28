import { observer } from "mobx-react-lite";
import { Routes, Route } from "react-router-dom";
import HomePresenter from "./HomePresenter.jsx";
import ProfilePresenter from "./ProfilePresenter.jsx";
import AuthentificationPresenter from "./AuthentificationPresenter.jsx";

const MainPresenter = observer(({ model }) => {
    return (
        <div className="flex flex-grow items-center justify-center">
            <Routes>
                <Route path="/" element={<HomePresenter model={model} />} />
                <Route path="/profile" element={<ProfilePresenter />} />
                <Route path="/auth" element={<AuthentificationPresenter />} />
            </Routes>
        </div>
    );
});

export default MainPresenter;
