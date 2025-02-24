import MigrationView from "../views/MigrationView.jsx";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";

const MigrationPresenter = observer(({ model }) => {
    const [strings, setStrings] = useState(model.strings);

    useEffect(() => {
        setStrings(model.strings);
    }, [model.strings]);
    

    return (
        <MigrationView model={model} strings={strings}/>
    );
});

export default MigrationPresenter;