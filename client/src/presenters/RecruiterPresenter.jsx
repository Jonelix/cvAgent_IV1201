import RecruiterView from "../views/RecruiterView.jsx";
import { observer } from "mobx-react-lite";

const RecruiterPresenter = observer((model, applicantsModel) => {
    return (
        <RecruiterView model={model} applicantsModel={applicantsModel}/>
    );
});

export default RecruiterPresenter;