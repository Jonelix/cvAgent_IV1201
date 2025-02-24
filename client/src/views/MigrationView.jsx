import React, { useState } from 'react';

const MigrationView = ({ model, strings }) => {
    const [email, setEmail] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [emailError, setEmailError] = useState('');
    const [idError, setIdError] = useState('');

    // Simple regex for email validation: ensures an "@" and a "."
    const validateEmail = (value) => {
        const regex = /^\S+@\S+\.\S+$/;
        return regex.test(value);
    };

    // Regex to check for exactly 8 digits, a dash, then 4 digits.
    const validateIdNumber = (value) => {
        const regex = /^\d{8}-\d{4}$/;
        return regex.test(value);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (value && !validateEmail(value)) {
        setEmailError('Please enter a valid email address.');
        } else {
        setEmailError('');
        }
    };

    const handleIdChange = (e) => {
        const value = e.target.value;
        setIdNumber(value);
        if (value && !validateIdNumber(value)) {
        setIdError('ID number must be 8 digits followed by a "-" then four digits.');
        } else {
        setIdError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Final validation on submit
        let valid = true;
        if (!validateEmail(email)) {
        setEmailError('Please enter a valid email address.');
        valid = false;
        }
        if (!validateIdNumber(idNumber)) {
        setIdError('ID number must be 8 digits followed by a "-" then four digits.');
        valid = false;
        }
        if (!valid) return;
    };

    const fetchMigratingUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/migratingUser", {
            //const response = await fetch("http://localhost:5005/api/migratingUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, idNumber }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            }

            console.log("Response:", data);
            return data;
        } catch (error) {
            console.error("Error:", error.message);
            return { error: error.message };
        }
    };

  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-100 p-8">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-left text-gray-700">
          {strings.migration || 'Migration'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

          {/* ID Number Input */}
          <div>
            <label className="block text-gray-600 text-sm font-semibold mb-2">
              {strings.id_number || 'ID Number'}
            </label>
            <input
              type="text"
              value={idNumber}
              onChange={handleIdChange}
              placeholder="12345678-1234"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                idError ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {idError && <p className="text-red-500 text-xs mt-1">{idError}</p>}
          </div>

          <button
            onClick={fetchMigratingUser}
            type="submit"
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all"
          >
            {strings.login || 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MigrationView;
