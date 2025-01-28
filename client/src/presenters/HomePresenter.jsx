import HomeView from "../views/HomeView.jsx";
import { observer } from "mobx-react-lite";

const HomePresenter = observer(({ model }) => {
    const handleSearch = () => {
        console.log("Search for:", model.text);
    };

    return (
        <HomeView
            text={model.text}
            onTextChange={(e) => model.setText(e.target.value)}
            onSearch={handleSearch}
        />
    );
});

export default HomePresenter;