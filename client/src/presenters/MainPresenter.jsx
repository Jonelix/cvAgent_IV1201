import { observer } from "mobx-react-lite";
import { Routes, Route } from "react-router-dom";
import HomePresenter from "./HomePresenter.jsx";
import ProfilePresenter from "./ProfilePresenter.jsx";

const MainPresenter = observer(({ model }) => {
    return (
        <Routes>
            <Route path="/" element={<HomePresenter model={model} />} />
            <Route path="/profile" element={<ProfilePresenter/>} />
        </Routes>
    );
});

export default MainPresenter;
