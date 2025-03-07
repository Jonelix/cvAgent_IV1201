/**
 * HomeView Component - Displays the home screen with a welcome message.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.model - Application model containing state and settings
 * @param {Object} props.strings - Localization strings for UI text
 * 
 * @returns {JSX.Element} HomeView component
 */

const HomeView = ({ model, strings }) => {
    

    return (
        <div className="flex items-center justify-center w-full h-full">
            <p className="italic text-xl">{strings.welcome}</p>
        </div>
    );
};

export default HomeView;
