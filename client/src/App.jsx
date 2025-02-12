import HeaderPresenter from "./presenters/HeaderPresenter.jsx";
import FooterPresenter from "./presenters/FooterPresenter.jsx";
import MainPresenter from "./presenters/MainPresenter.jsx";
import UserModel from "./models/userModel";

const userModel = new UserModel();

function App() {
    return (
        <div className="flex flex-col min-h-screen">
            <HeaderPresenter model={userModel} />
            <main className="flex-grow flex pt-[6rem]">
                <MainPresenter model={userModel} />
            </main>
            <FooterPresenter />
        </div>
    );
}

export default App;
