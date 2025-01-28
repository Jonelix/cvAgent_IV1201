const HeaderView = ({ userEmail, loggedIn }) => {

    function goToHome(){
        window.location.href = "#/";
    }

    function goToAuthentification() {
        window.location.href = "#/auth";
    }

    return (
        <header className="bg-gray-800 text-white flex items-center justify-between px-6 py-4 shadow-lg w-full fixed top-0 z-10">
            {/* Icon + Title */}
            <div  onClick={goToHome} className="flex items-center gap-2">
                <img src="/agent.png" alt="CV Agent Logo" className="w-14 h-14 mr-5" />
                <h1 className="text-2xl font-bold">CV Agent</h1>
            </div>

            {/* Profile Button */}
            <div>
                {loggedIn ? (
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
                        {userEmail || "Username"}
                    </button>
                ) : (
                    <button onClick={goToAuthentification} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
                        Profile
                    </button>
                )}
            </div>
        </header>
    );
};

export default HeaderView;