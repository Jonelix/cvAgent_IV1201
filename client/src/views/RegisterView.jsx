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
    const [errors, setErrors] = useState({});

    const validateFields = () => {
        let newErrors = {};

        // First Name Validation
        setFirstName(firstName.trim());
        if (!/^[A-Za-z]{2,255}$/.test(firstName)) {
            newErrors.firstName = "First name must be alphabetic, 2-255 characters.";
        }

        // Last Name Validation
        setLastName(lastName.trim());
        if (!/^[A-Za-z]{2,255}$/.test(lastName)) {
            newErrors.lastName = "Last name must be alphabetic, 2-255 characters.";
        }

        // Person Number Validation
        const cleanedPersonNumber = personNumber.replace(/-/g, '');
        if (!/^\d{12}$/.test(cleanedPersonNumber)) {
            newErrors.personNumber = "ID Number must be exactly 12 digits.";
        }

        // Username Validation
        setUsername(username.trim());
        if (!/^[A-Za-z0-9]{6,255}$/.test(username)) {
            newErrors.username = "Username must be alphanumeric, 6-255 characters.";
        }

        // Email Validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Invalid email format.";
        }

        // Password Validation
        if (!/^[A-Za-z0-9!@$%^&*+#]{6,255}$/.test(password)) {
            newErrors.password = "Password must be 6-255 characters and may contain alphanumeric characters with (!, @, $, %, ^, &, *, +, #).";
        }

        // Confirm Password Validation
        if (confirmPassword !== password) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const registerUser = async (e) => {
        e.preventDefault();
        if (!validateFields()) return;
        
        try {
            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, personNumber, username, email, password, confirmPassword }),
            });
    
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            
            console.log("Response:", data);
            return data;
        } catch (error) {
            console.error("Error:", error.message);
            return { error: error.message };
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 p-8">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6 text-left text-gray-700">Register</h2>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-6">
                        {[{ label: "First name", state: firstName, setState: setFirstName, name: "firstName" },
                          { label: "Last Name", state: lastName, setState: setLastName, name: "lastName" },
                          { label: "ID Number", state: personNumber, setState: setPersonNumber, name: "personNumber" },
                          { label: "Username", state: username, setState: setUsername, name: "username" }]
                        .map(({ label, state, setState, name }) => (
                            <div key={name}>
                                <label className="block text-gray-600 text-sm font-semibold mb-2">{label}</label>
                                <input 
                                    type="text" 
                                    value={state} 
                                    onChange={(e) => setState(e.target.value)} 
                                    className={`w-full p-3 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-6">
                        {[{ label: "Email", state: email, setState: setEmail, name: "email" },
                          { label: "Password", state: password, setState: setPassword, name: "password" },
                          { label: "Confirm Password", state: confirmPassword, setState: setConfirmPassword, name: "confirmPassword" }]
                        .map(({ label, state, setState, name }) => (
                            <div key={name}>
                                <label className="block text-gray-600 text-sm font-semibold mb-2">{label}</label>
                                <input 
                                    type="text" 
                                    value={state} 
                                    onChange={(e) => setState(e.target.value)} 
                                    className={`w-full p-3 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
                            </div>
                        ))}
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
