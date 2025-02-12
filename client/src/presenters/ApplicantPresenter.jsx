import ApplicantView from "../views/ApplicantView.jsx";
import { observer } from "mobx-react-lite";

const ApplicantPresenter = observer(() => {
    return (
        <ApplicantView model={model}/>
    );
});

export default ApplicantPresenter;