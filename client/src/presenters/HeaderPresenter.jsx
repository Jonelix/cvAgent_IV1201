import HeaderView from "../views/HeaderView.jsx";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";

const HeaderPresenter = observer(({ model }) => {
    const [strings, setStrings] = useState(model.strings);
    
    useEffect(() => {
        setStrings(model.strings);
    }, [model.strings]);

    return <HeaderView model={model} isLoggedIn={model.isLoggedIn} strings={strings} />;
});

export default HeaderPresenter;