import React, { useState } from 'react';
import { observer } from "mobx-react-lite";

const RegisterView = observer(({strings}) => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [personNumber, setPersonNumber] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

    const validateFields = () => {
        let newErrors = {};

        setFirstName(firstName.trim());
        if (!/^[A-Za-z]{2,255}$/.test(firstName)) {
            newErrors.firstName = strings.error_first_name;
        }

        setLastName(lastName.trim());
        if (!/^[A-Za-z]{2,255}$/.test(lastName)) {
            newErrors.lastName = strings.error_last_name;
        }

        const cleanedPersonNumber = personNumber.replace(/-/g, '');
        if (!/^\d{12}$/.test(cleanedPersonNumber)) {
            newErrors.personNumber = strings.error_id_number;
        }

        setUsername(username.trim());
        if (!/^[A-Za-z0-9]{6,255}$/.test(username)) {
            newErrors.username = strings.error_username;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = strings.error_email;
        }

        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@$%^&*+#])[A-Za-z\d!@$%^&*+#]{6,255}$/.test(password)) {
            newErrors.password = strings.error_password;
        }        

        if (confirmPassword !== password) {
            newErrors.confirmPassword = strings.error_confirm_password;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    function goToLogin() {
        window.location.href = "#/auth";
    }

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
            alert("User registered successfully");
            console.log("Response:", data);
            goToLogin();
            return data;
        } catch (error) {
            console.error("Error:", error.message);
            return { error: error.message };
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 p-8">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6 text-left text-gray-700">{strings.register}</h2>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-6">
                        {[{ label: strings.first_name, state: firstName, setState: setFirstName, name: "firstName" },
                          { label: strings.last_name, state: lastName, setState: setLastName, name: "lastName" },
                          { label: strings.id_number, state: personNumber, setState: setPersonNumber, name: "personNumber" },
                          { label: strings.username, state: username, setState: setUsername, name: "username" }]
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
                        {/* Email Field */}
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-2">{strings.email}</label>
                            <input 
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        {/* Password Field with Show/Hide */}
                        <div className="relative">
                            <label className="block text-gray-600 text-sm font-semibold mb-2">{strings.password}</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
                                className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16`}
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
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>

                        {/* Confirm Password Field with Show/Hide */}
                        <div className="relative">
                            <label className="block text-gray-600 text-sm font-semibold mb-2">{strings.confirm_password}</label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onFocus={() => setIsConfirmPasswordFocused(true)}
                                onBlur={() => setIsConfirmPasswordFocused(false)}
                                className={`w-full p-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16`}
                            />
                            {isConfirmPasswordFocused && (
                                <button
                                    type="button"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        setShowConfirmPassword(!showConfirmPassword);
                                    }}
                                    className="absolute right-3 text-sm text-blue-500 hover:underline"
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            )}
                            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                        </div>


                        <button onClick={registerUser} className="w-full mt-7 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all">
                            {strings.register}
                        </button>

                        <button 
                            onClick={goToLogin} 
                            className="text-blue-500 hover:underline flex justify-center items-center">
                            {strings.already_has_account}?
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
});

export default RegisterView;
