import HeaderView from "../views/HeaderView.jsx";
import { observer } from "mobx-react-lite";

const HeaderPresenter = observer(({ model }) => {
    return <HeaderView userEmail={model.userEmail} loggedIn={model.loggedIn} />;
});

export default HeaderPresenter;