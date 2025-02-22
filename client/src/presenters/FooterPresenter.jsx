import FooterView from "../views/FooterView.jsx";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";

const FooterPresenter = observer(({model}) => {
    const [strings, setStrings] = useState(model.strings);
    
        useEffect(() => {
            setStrings(model.strings);
        }, [model.strings]);

    return <FooterView strings={strings}/>;
});

export default FooterPresenter;