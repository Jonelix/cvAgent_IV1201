const AuthentificationView = () => {
    function goToRegister() {
        // Redirect to the register page
        window.location.href = "#/registration";
    }
    
    return (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 p-8">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                {/* Title */}
                <h2 className="text-2xl font-bold mb-6 text-left text-gray-700">Login</h2>

                {/* Login Form */}
                <form className="flex flex-col gap-6">
                    {/* Username or Email */}
                    <div>
                        <label className="block text-gray-600 text-sm font-semibold mb-2">Username or Email</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-600 text-sm font-semibold mb-2">Password</label>
                        <input 
                            type="password" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>

                    {/* Login Button */}
                    <div>
                        <button className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all">
                            Login
                        </button>
                    </div>

                    {/* Register Link */}
                    <div className="text-center">
                        <p onClick={goToRegister} className="text-blue-500 hover:underline">
                            Register an account
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthentificationView;