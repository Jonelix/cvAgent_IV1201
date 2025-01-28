import HomeView from "../views/HomeView.jsx";
import { observer } from "mobx-react-lite";

const HomePresenter = observer(() => {
    return (
        <HomeView />
    );
});

export default HomePresenter;