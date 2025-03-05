import React from 'react';
import { observer } from "mobx-react-lite";

/**
 * HeaderView Component - Displays the application header with navigation options.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.model - Application model containing state and settings
 * @param {boolean} props.isLoggedIn - Boolean flag indicating if the user is logged in
 * @param {Object} props.strings - Localization strings for UI text
 * 
 * @returns {JSX.Element} HeaderView component
 */
const HeaderView = observer(({ model, isLoggedIn, strings}) => {
    /**
     * Redirects the user to the home page.
     */
    function goToHome(){
        window.location.href = "#/";
    }

    /**
     * Handles the profile button click.
     * If the user is logged in, redirects to profile.
     * Otherwise, redirects to authentication.
     */
    function handleProfileButton() {
        if (isLoggedIn) {
            goToProfile();
        } else {
            goToAuthentification();
        }
    }

    /**
     * Redirects the user to the profile page.
     */
    function goToProfile() {
        window.location.href = "#/profile";
    }

    /**
     * Redirects the user to the authentication page.
     */
    function goToAuthentification() {
        window.location.href = "#/auth";
    }

    /**
     * Redirects the user to the dashboard if logged in, otherwise to authentication.
     */
    const goToDashboard = () => {
        if (isLoggedIn) {
            window.location.href = "#/dashboard";
        } else {
            window.location.href = "#/auth";
        }
    };

    /**
     * Handles language change selection.
     * 
     * @param {Event} e - Change event from the language dropdown
     */
    const handleLanguageChange = (e) => {
        const selectedLanguage = e.target.value;
        model.setLanguage(selectedLanguage);
    };

    return (
        <header className="bg-gray-800 text-white flex items-center justify-between px-6 py-4 shadow-lg w-full fixed top-0 z-10">
            {/* Left Section: Icon, Title, Dashboard */}
            <div className="flex items-center gap-4">
                <div onClick={goToHome} className="flex items-center gap-2 cursor-pointer">
                    <img src="/agent.png" alt="CV Agent Logo" className="w-14 h-14 mr-5" />
                    <h1 className="text-2xl font-bold">CV Agent</h1>
                </div>
                <button 
                    onClick={goToDashboard} 
                    className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 ml-8 rounded-lg">
                        {strings.dashboard}
                </button>
            </div>

            {/* Right Section: Language Dropdown + Profile */}
            <div className="flex items-center gap-4">
                <select
                    onChange={handleLanguageChange}
                    defaultValue="en"
                    className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg"
                >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                </select>
                <button 
                    onClick={handleProfileButton} 
                    className="bg-slate-600 hover:bg-slate-400 text-white font-semibold py-2 px-4 rounded-lg"
                >
                    {strings.profile}
                </button>
            </div>
        </header>
    );
});

export default HeaderView;
