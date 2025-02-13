import React, { useState } from 'react';


const AuthentificationView = ({onLoginSuccess}) => {
    function goToRegister() {
        // Redirect to the register page
        window.location.href = "#/registration";
    }
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const fetchUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5005/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
    
            const data = await response.json(); // Parse JSON response
            
            if (!response.ok) {
                // Return the detailed error message from the server response
                throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            }
    
            console.log("Response:", data);
            // Pass user data up to the presenter
            onLoginSuccess(data);
            return data; // Return user data if successful
        } catch (error) {
            console.error("Error:", error.message);
            return { error: error.message }; // Return error message instead of throwing
        }
    };

    const fetchCompetencies = async (e) => {
        try {
            const response = await fetch("http://localhost:5005/api/competencies", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json(); // Parse JSON response
            
            if (!response.ok) {
                // Return the detailed error message from the server response
                throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            }
    
            console.log("Response:", data);
            return data; // Return user data if successful
        } catch (error) {
            console.error("Error:", error.message);
            return { error: error.message }; // Return error message instead of throwing
        }
    };

    const fetchProfile = async (e) => {
        try {
            const response = await fetch("http://localhost:5005/api/applicantProfile", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (!response.ok) {
                // Return the detailed error message from the server response
                throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            }

            console.log("Response:", data);
            return data; // Return user data if successfuls
        }catch (error) {
            console.error("Error:", error.message);
            return { error: error.message }; // Return error message instead of throwing
        }
    };
    

    return (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 p-8">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                {/* Title */}
                <h2 className="text-2xl font-bold mb-6 text-left text-gray-700">Login</h2>

                {/* Login Form */}
                <form className="flex flex-col gap-6">
                    {/* Username */}
                    <div>
                        <label className="block text-gray-600 text-sm font-semibold mb-2">Username</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-600 text-sm font-semibold mb-2">Password</label>
                        <input 
                            type="password" 
                            value={password}  // Bind the password state here
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>
                    {/* Login Button */}
                    <div>
                        <button onClick={fetchUser} className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all">
                            Login
                        </button>
                    </div>

                   

                    {/* Register Link */}
                    <div className="text-center">
                        <p onClick={goToRegister} className="text-blue-500 hover:underline">
                            Register an account
                        </p>
                    </div>

                    <div className="text-center">
                        <p onClick={fetchCompetencies} className="text-blue-500 hover:underline">
                            Fetch Competencies                        </p>
                    </div>

                    <div className="text-center">
                        <p onClick={fetchProfile} className="text-blue-500 hover:underline">
                            Check earlier applcant compentencies                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthentificationView;