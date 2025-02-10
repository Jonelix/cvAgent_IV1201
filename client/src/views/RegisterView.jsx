import React, { useState } from 'react';
import { observer } from "mobx-react-lite";

const RegisterPresenter = observer(() => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [personNumber, setPersonNumber] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const registerUser = async (e) => {
        e.preventDefault();
        try {
            //console.log("https://cvagent-b8c3fb279d06.herokuapp.com/api/register");
            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ firstName, lastName, personNumber, username, email, password, confirmPassword }),
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


    return (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 p-8">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
                {/* Title */}
                <h2 className="text-2xl font-bold mb-6 text-left text-gray-700">Register</h2>

                {/* Registration Form */}
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Column 1 */}
                    <div className="flex flex-col gap-6">
                        {/* First Name */}
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-2">First name</label>
                            <input 
                            type="text" 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-2">Last Name</label>
                            <input 
                            type="text" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>

                        {/* ID Number */}
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-2">ID Number</label>
                            <input 
                            type="text" 
                            value={personNumber} 
                            onChange={(e) => setPersonNumber(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-2">Username</label>
                            <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col gap-6">
                        {/* Email */}
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-2">Email</label>
                            <input 
                            type="text" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-2">Password</label>
                            <input 
                            type="text" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-2">Confirm Password</label>
                            <input 
                            type="text" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>

                        {/* Register Button */}
                        <div>
                            <button onClick={registerUser} className="w-full mt-7 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all">
                                Register
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
});

export default RegisterPresenter;