import RegisterView from '../views/RegisterView';
import { observer } from 'mobx-react-lite';

const RegisterPresenter = observer(() => {
    return (
        <RegisterView model={model}/>
    );
});

export default RegisterPresenter;