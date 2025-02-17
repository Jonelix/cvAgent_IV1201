import React from "react";
import { useNavigate } from "react-router-dom";

const ApplicantView = () => {
    const navigate = useNavigate();

    const handleCreateNewApplication = () => {
        // Logic to reset application state
        navigate("/applicant", { state: { newApplication: true } });
    };

    const handleFetchCompetence = () => {
        console.log("Fetching competence data...");
        // Placeholder for fetching logic
    };

    return (
        <div className="flex flex-col w-full h-full p-6">
            {/* Header Section */}
            <div className="flex justify-between items-center w-full mb-6">
                <h1 className="text-2xl font-bold">Current Application</h1>
                <button 
                    onClick={handleCreateNewApplication} 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Create New Application
                </button>
            </div>
            
            {/* Application Details */}
            <div className="flex gap-6 w-full">
                {/* Competence Section */}
                <div className="flex-1 p-4 border rounded shadow-md">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-semibold">Competence</h2>
                        <button 
                            onClick={handleFetchCompetence} 
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                            Fetch Data
                        </button>
                    </div>
                    <p className="text-gray-600">(Competence details will be displayed here)</p>
                </div>
                
                {/* Availability Section */}
                <div className="flex-1 p-4 border rounded shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Availability</h2>
                    <p className="text-gray-600">(Availability details will be displayed here)</p>
                </div>
            </div>
        </div>
    );
};

export default ApplicantView;
