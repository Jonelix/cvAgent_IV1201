import RegisterView from '../views/RegisterView';
import { observer } from 'mobx-react-lite';

const RegisterPresenter = observer((model, applicantsModel) => {
    return (
        <RegisterView model={model} applicantsModel={applicantsModel}/>
    );
});

export default RegisterPresenter;