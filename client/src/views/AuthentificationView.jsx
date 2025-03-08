import React, { useState, useRef } from 'react';

/**
 * AuthentificationView Component - Handles user login authentication.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onLoginSuccess - Callback function executed when login is successful
 * @param {Object} props.strings - Localization strings for UI text
 * 
 * @returns {JSX.Element} AuthentificationView component
 */
const AuthentificationView = ({ onLoginSuccess, strings }) => {
    /**
     * Redirects the user to the registration page.
     */
    function goToRegister() {
        window.location.href = "#/registration";
    }

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [error, setError] = useState("");
    const passwordInputRef = useRef(null);

    /**
     * Fetches available competencies from API.
     * 
     * @param {Event} e - Form submission event
     * @returns {Promise<Object>} API response data
     */
    const fetchCompetencies = async (e) => {
        e.preventDefault();
        try{
            //const response = await fetch("http://localhost:5005/api/competencies", {
            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/competencies", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await response.json();
            if (!response.ok) {
                // Return the detailed error message from the server response
                throw new Error(data.message || "Failed to fetch profile");
            }
            console.log("Response:", data);
            return data;
        }catch(error){
            //console.error("Error:", error.message);
            setError(error.message);
            //return { error: error.message };
        }
    }

    /**
     * Handles user login by sending credentials to API.
     * 
     * @param {Event} e - Form submission event
     * @returns {Promise<Object>} API response data
     */
    const fetchUser = async (e) => {
        e.preventDefault();
      console.log("sending to api/login");
        try {

            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/login", {
            //const response = await fetch("http://localhost:5005/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
          console.log("fetchuser resp:");
          console.log(data)
            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            console.log("Response:", data);
            onLoginSuccess(data);
            return data;
        } catch (error) {
            //console.error("Error:", error.message);
            setError(error.message);
            // return { error: error.message };
        }
    };

    /**
     * Fetches user profile data from API.
     * 
     * @returns {Promise<Object>} API response data
     */
    const fetchProfile = async (e) => {
        try {
            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/applicantProfile", {
            //const response = await fetch("http://localhost:5005/api/applicantProfile", {
            method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (!response.ok) {
                // Return the detailed error message from the server response
                throw new Error(data.message || "Failed to fetch profile");
            }

            console.log("Response:", data);
            return data; // Return user data if successfuls
        }catch (error) {
            // console.error("Error:", error.message);
            setError(error.message);
            // return { error: error.message }; // Return error message instead of throwing
        }
    };


    return (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 p-8">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-left text-gray-700">{strings.login}</h2>

                <form className="flex flex-col gap-6">
                    <div>
                        <label className="block text-gray-600 text-sm font-semibold mb-2">{strings.username}</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <input type="text" autoComplete="username" className="hidden" />

                    <div className="relative">
                        <label className="block text-gray-600 text-sm font-semibold mb-2">{strings.password}</label>
                        <div className="relative flex items-center">
                            <input
                                ref={passwordInputRef}
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
                                autoComplete="new-password"
                                inputMode="text"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-14"
                            />


                            {isPasswordFocused && (
                                <button
                                    type="button"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        setShowPassword(!showPassword);
                                    }}
                                    className="absolute right-3 text-sm text-blue-500 hover:underline"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                
                    <button onClick={fetchUser} className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all">
                        {strings.login}
                    </button>

                    {/* Display Error Message with Space */}
                    {error && (
                        <div className="text-red-500 text-center mt-4 mb-2">
                            {error}
                         </div>
                    )}

                    </div>


                    <div className="text-center">
                        <p onClick={goToRegister} className="text-blue-500 hover:underline">
                            {strings.register_an_account}
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthentificationView;
