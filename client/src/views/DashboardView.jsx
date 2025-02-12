import React from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router for navigation

const DashboardView = ({ model }) => {
    return (
        <div className="w-full min-h-screen bg-gray-100">
            {/* Top Navigation Bar */}
            <div className="bg-white shadow-md p-4 flex justify-between items-center">
                <Link to="/start-new-application" className="text-blue-600 font-semibold hover:text-blue-800">
                    Start a New Application
                </Link>
                <h1 className="text-xl font-bold text-gray-700">Dashboard</h1>
            </div>

            {/* Main Content */}
            <div className="p-8">
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Current Application</h2>
                    
                    {/* Display the most current application (initially empty) */}
                    {model.currentApplication ? (
                        <div className="space-y-4">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600 font-semibold">Application ID:</span>
                                <span className="text-gray-800">{model.currentApplication.id}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600 font-semibold">Status:</span>
                                <span className="text-gray-800">{model.currentApplication.status}</span>
                            </div>
                            {/* Add more fields as needed */}
                        </div>
                    ) : (
                        <p className="text-gray-600">No current application available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardView;