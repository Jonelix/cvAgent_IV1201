import RegisterView from '../views/RegisterView';
import { observer } from 'mobx-react-lite';

const RegisterPresenter = observer(() => {
    return (
        <RegisterView/>
    );
});

export default RegisterPresenter;