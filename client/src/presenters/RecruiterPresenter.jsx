import RecruiterView from "../views/RecruiterView.jsx";
import { observer } from "mobx-react-lite";

const RecruiterPresenter = observer(() => {
    return (
        <RecruiterView model={model}/>
    );
});

export default RecruiterPresenter;