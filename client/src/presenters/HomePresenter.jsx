import HomeView from "../views/HomeView.jsx";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";

const HomePresenter = observer(({ model }) => {
    const [strings, setStrings] = useState(model.strings);

    useEffect(() => {
        setStrings(model.strings);
    }, [model.strings]);
    

    return (
        <HomeView model={model} strings={strings}/>
    );
});

export default HomePresenter;