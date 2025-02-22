import RegisterView from '../views/RegisterView';
import { observer } from 'mobx-react-lite';
import { useState, useEffect } from "react";

const RegisterPresenter = observer(({model}) => {
    const [strings, setStrings] = useState(model.strings);
    
    useEffect(() => {
        setStrings(model.strings);
    }, [model.strings]);

    return (
        <RegisterView model={model} strings={strings}/>
    );
});

export default RegisterPresenter;