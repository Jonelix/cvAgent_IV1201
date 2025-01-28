const HeaderView = ({ userEmail, loggedIn }) => {
    return (
        <header className="bg-gray-800 text-white flex items-center justify-between px-6 py-4 shadow-lg w-full fixed top-0 z-10">
            {/* Webpage title */}
            <h1 className="text-2xl font-bold">CV Agent</h1>

            {/* Profile Button */}
            <div>
                {loggedIn ? (
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
                        {userEmail || "Profile"}
                    </button>
                ) : (
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
                        Login
                    </button>
                )}
            </div>
        </header>
    );
};

export default HeaderView;