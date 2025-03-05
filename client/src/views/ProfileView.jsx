import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

/**
 * ProfileView Component - Displays and allows editing of user profile information.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.model - User model containing personal information
 * @param {Object} props.strings - Localization strings for UI text
 * @param {Function} props.onLoginSuccess - Callback function executed when profile update is successful
 * 
 * @returns {JSX.Element} ProfileView component
 */
const ProfileView = ({ model, strings, onLoginSuccess }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [email, setEmail] = useState(model.email || "");
    const [pnr, setPnr] = useState(model.pnr || "");
    const [currentModel, setCurrentModel] = useState(model);

    /**
     * Logs the user out and redirects to the login page.
     */
    function backToLogin() {
        window.location.href = "#/auth";
        model.logOut();

    }
    /**
     * Enables edit mode for updating profile information.
     */
    function handleUpdateInfo() {
        setIsEditing(true);
    }

    /**
     * Cancels the edit mode and reverts changes.
     */
    function handleCancel() {
        setIsEditing(false);
    }
    
     /**
     * Updates recruiter details by sending updated email and personal number to API.
     * 
     * @param {Event} e - Form submission event
     * @returns {Promise<Object>} API response data
     */
    const updateRecruiterDetails = async (e) => {
        e.preventDefault();
        try {
            
            // const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/updateRecruiter", {
            const response = await fetch("http://localhost:5005/api/updateRecruiter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ person_id: model.person_id, email, pnr }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            }

            console.log("Response:", data);
            onLoginSuccess(data.application);
            setIsEditing(false);
            return data;
        } catch (error) {
            console.error("Error:", error.message);
            return { error: error.message };
        }
    };

    return (
        <div className="w-full flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                {/* Dashboard Button */}
                <div className="flex justify-between items-center mb-6">
                    <Link
                        to="/dashboard"
                        className="text-blue-600 font-semibold hover:text-blue-800"
                    >
                        {strings.dashboard}
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-700">{strings.user_profile}</h2>
                </div>

                {isEditing ? (
                    <div className="space-y-4">
                        <div>
                            <label className="text-gray-600 font-semibold">{strings.email}</label>
                            <input
                                type="email"
                                className="w-full border p-2 rounded"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-gray-600 font-semibold">{strings.id_number}</label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                value={pnr}
                                onChange={(e) => setPnr(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-between mt-4">
                            <button onClick={handleCancel} className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all">
                                {strings.cancel}
                            </button>
                            <button onClick={updateRecruiterDetails} className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all">
                                {strings.confirm}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600 font-semibold">{strings.full_name}</span>
                            <span className="text-gray-800">{model?.name} {model?.surname}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600 font-semibold">{strings.username}</span>
                            <span className="text-gray-800">{model?.username}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600 font-semibold">{strings.email}</span>
                            <span className="text-gray-800">{model?.email}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600 font-semibold">{strings.user_id}</span>
                            <span className="text-gray-800">{model?.person_id}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600 font-semibold">{strings.id_number}</span>
                            <span className="text-gray-800">{model?.pnr}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600 font-semibold">{strings.role_id}</span>
                            <span className="text-gray-800">{model?.role_id}</span>
                        </div>
                    </div>
                )}

                {model.role_id === 1 && (model.email == null || model.pnr == null || model.email == "" || model.pnr == "") && !isEditing && (
                    <button
                        onClick={handleUpdateInfo}
                        className="w-full bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-all mt-4">
                        {strings.missing_info}
                    </button>
                )}

                {!isEditing && (<div className="mt-4">
                    <button onClick={backToLogin} className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all">
                        {strings.back_to_login}
                    </button>
                </div>)}
            </div>
        </div>
    );
};

export default ProfileView;
