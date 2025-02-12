import ProfileView from "../views/ProfileView.jsx";
import { observer } from "mobx-react-lite";

const ProfilePresenter = observer(({ model }) => {
    return <ProfileView model={model} />;
});

export default ProfilePresenter;
