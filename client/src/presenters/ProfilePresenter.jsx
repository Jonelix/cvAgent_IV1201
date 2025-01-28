import ProfileView from "../views/ProfileView.jsx";
import { observer } from "mobx-react-lite";

const ProfilePresenter = observer(() => {

    return (
        <ProfileView />
    );
});

export default ProfilePresenter;