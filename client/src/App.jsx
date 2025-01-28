import HeaderPresenter from "./presenters/HeaderPresenter.jsx";
import FooterPresenter from "./presenters/FooterPresenter.jsx";
import MainPresenter from "./presenters/MainPresenter.jsx";
import userModel from "./models/userModel";

function App() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <HeaderPresenter model={userModel} />

            {/* Main content (with padding to avoid overlap) */}
            <main className="flex-grow pt-18 pb-18">
                <MainPresenter model={userModel} />
            </main>

            {/* Footer */}
            <FooterPresenter />
        </div>
    );
}


export default App;
