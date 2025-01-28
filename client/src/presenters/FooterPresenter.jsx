import FooterView from "../views/FooterView.jsx";
import { observer } from "mobx-react-lite";

const FooterPresenter = observer(() => {
    return <FooterView />;
});

export default FooterPresenter;