import HeaderView from "../views/HeaderView.jsx";
import { observer } from "mobx-react-lite";

const HeaderPresenter = observer(({ model }) => {
    return <HeaderView model={model} isLoggedIn={model.isLoggedIn} />;
});

export default HeaderPresenter;