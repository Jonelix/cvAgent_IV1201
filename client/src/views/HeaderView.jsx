import React from 'react';
import { observer } from "mobx-react-lite";

const HeaderView = observer(({ model, isLoggedIn, strings}) => {

    function goToHome(){
        window.location.href = "#/";
    }

    function handleProfileButton() {
        if (isLoggedIn) {
            goToProfile();
        } else {
            goToAuthentification();
        }
    }

    function goToProfile() {
        window.location.href = "#/profile";
    }

    function goToAuthentification() {
        window.location.href = "#/auth";
    }

    const goToDashboard = () => {
        if (isLoggedIn) {
            window.location.href = "#/dashboard";
        } else {
            window.location.href = "#/auth";
        }
    };

    // Language change handler
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
