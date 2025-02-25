import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MigrationView = ({ model, strings, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [passcode, setPasscode] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [emailError, setEmailError] = useState('');
    const [passcodeError, setPasscodeError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [step, setStep] = useState(1); // 1 = Email Entry, 2 = Passcode Entry, 3 = Complete Registration

    // Simple regex for email validation: ensures an "@" and a "."
    const validateEmail = (value) => {
        const regex = /^\S+@\S+\.\S+$/;
        return regex.test(value);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setEmailError(validateEmail(value) ? '' : 'Please enter a valid email address.');
    };

    const handlePasscodeChange = (e) => {
        setPasscode(e.target.value);
        setPasscodeError('');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const fetchCreatePasscode = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        try {
            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/requestPasscode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!response.ok || data.application == null) throw new Error(data.message || `HTTP error! Status: ${response.status}`);

            console.log("Passcode Sent:", data);
            setStep(2); // Move to passcode verification stage
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    const fetchConfirmPasscode = async (e) => {
        e.preventDefault();
        if (!passcode) {
            setPasscodeError('Please enter the passcode.');
            return;
        }

        try {
            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/confirmPasscode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, passcode }),
            });

            const data = await response.json();
            if (!response.ok || data.application == null) throw new Error(data.message || `HTTP error! Status: ${response.status}`);

            console.log("Passcode Verified:", data);
            setStep(3); // Move to final registration stage
        } catch (error) {
            console.error("Error:", "Email not valid.");
            setPasscodeError("Invalid passcode. Please try again.");
        }
    };

    const fetchRegisterMissingInfo = async (e) => {
        e.preventDefault();
        if (!username || !password || !confirmPassword) {
            setPasswordError("All fields are required.");
            return;
        }
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/updateMigratingApplicant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, passcode, username, password, confirmPassword }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `HTTP error! Status: ${response.status}`);

            console.log("User Updated:", data);
            onLoginSuccess(data.application);
        } catch (error) {
            console.error("Error:", error.message);
            setPasswordError("Error updating user. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 p-8">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-left text-gray-700">
                    {strings.migration || 'Migration'}
                </h2>

                {step === 1 && (
                    <form onSubmit={fetchCreatePasscode} className="flex flex-col gap-6">
                        {/* Email Input */}
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-2">
                                {strings.email || 'Email'}
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    emailError ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            />
                            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                        </div>

                        <button type="submit" className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all">
                            {strings.continue || 'Request Passcode'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={fetchConfirmPasscode} className="flex flex-col gap-6">
                        {/* Passcode Input */}
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-2">
                                {strings.recovery_code || 'Passcode'}
                            </label>
                            <input
                                type="text"
                                value={passcode}
                                onChange={handlePasscodeChange}
                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    passcodeError ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            />
                            {passcodeError && <p className="text-red-500 text-xs mt-1">{passcodeError}</p>}
                        </div>

                        <button type="submit" className="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all">
                            {strings.continue || 'Verify Code'}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={fetchRegisterMissingInfo} className="flex flex-col gap-6">
                        {/* Username */}
                        <input type="text" placeholder={strings.username} value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 border rounded-lg" required />

                        {/* Password */}
                        <input type="password" placeholder={strings.password} value={password} onChange={handlePasswordChange} className="w-full p-3 border rounded-lg" required />

                        {/* Confirm Password */}
                        <input type="password" placeholder={strings.confirm_password} value={confirmPassword} onChange={handleConfirmPasswordChange} className="w-full p-3 border rounded-lg" required />
                        
                        {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}

                        <button type="submit" className="w-full bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-all">
                            {strings.continue || 'Update User'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default MigrationView;
