import React from "react";
import { observer } from "mobx-react-lite";
import DashboardView from "../views/DashboardView.jsx";

const DashboardPresenter = observer(({ model }) => {
    return <DashboardView model={model} />;
});

export default DashboardPresenter;