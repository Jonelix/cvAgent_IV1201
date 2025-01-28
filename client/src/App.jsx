import HeaderPresenter from "./presenters/HeaderPresenter.jsx";
import FooterPresenter from "./presenters/FooterPresenter.jsx";
import MainPresenter from "./presenters/MainPresenter.jsx";
import userModel from "./models/userModel";

function App() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <HeaderPresenter model={userModel} />

            {/* Main content (Ensures it expands between header and footer) */}
            <main className="flex-grow flex">
                <MainPresenter model={userModel} />
            </main>

            {/* Footer */}
            <FooterPresenter />
        </div>
    );
}

export default App;