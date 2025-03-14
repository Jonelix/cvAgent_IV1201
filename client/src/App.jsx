import HeaderPresenter from "./presenters/HeaderPresenter.jsx";
import FooterPresenter from "./presenters/FooterPresenter.jsx";
import MainPresenter from "./presenters/MainPresenter.jsx";
import UserModel from "./models/userModel";
import ApplicantsModel from "./models/applicantsModel.js";

const userModel = new UserModel();
const applicantsModel = new ApplicantsModel();

/**
 * App Component - The main entry point of the application.
 * It initializes the user and applicants models and integrates the primary layout structure.
 * 
 * @returns {JSX.Element} The App component containing header, main content, and footer.
 */
function App() {
    return (
        <div className="flex flex-col min-h-screen">
            <HeaderPresenter model={userModel} />
            <main className="flex-grow flex pt-[6rem]">
                <MainPresenter model={userModel} applicantsModel={applicantsModel}/>
            </main>
            <FooterPresenter model={userModel} />
        </div>
    );
}

export default App;
