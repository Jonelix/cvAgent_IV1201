import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const ApplicantView = ({ model }) => {
    const navigate = useNavigate();
    const [competencies, setCompetencies] = useState([]);
    const [userCompetencies, setUserCompetencies] = useState([]);
    const [person, setPerson] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [stage, setStage] = useState("main"); // Track current stage: "main", "competence", "availability", "summary"
    const [selectedCompetence, setSelectedCompetence] = useState(""); // Store selected competence
    const [selectedAvailability, setSelectedAvailability] = useState({ fromDate: "", toDate: "" }); // Store selected availability
    const [userAvailability, setUserAvailability] = useState([]);
    const [isApplicationUpdated, setIsApplicationUpdated] = useState(false); // Track if application is updated

    const handleCreateNewApplication = () => {
        setStage("competence"); // Move to the competence stage
    };

    // Fetch competencies automatically when stage changes to "competence"
    useEffect(() => {
        if (stage === "competence") {
            fetchCompetencies();
        }
    }, [stage]); // Trigger when `stage` changes


    const fetchCompetencies = async () => {
        try {
            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/competencies");
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            setCompetencies(data);
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    const fetchUserCompetencies = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/userCompetencies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ person_id: model?.person_id }), 
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            setUserCompetencies(data);
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    const fetchUserAvailability = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/userAvailability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ person_id: model?.person_id }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            setUserAvailability(data);
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    const updateUserProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5005/api/createApplication", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    person_id: model?.person_id, 
                    competencies: userCompetencies,  // Send all competencies
                    availability: {
                        from_date: selectedAvailability.fromDate,
                        to_date: selectedAvailability.toDate
                    }
                }),
            });
    
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            
            if(data.message) {
                alert(data.message);
                await fetchUserCompetencies(e);
                await fetchUserAvailability(e);
                setIsApplicationUpdated(true);
                setStage("main");
            }
        } catch (error) {
            console.error("Error:", error.message);
            alert(error.message);
        }
    };

    const removeUserCompetence = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch("http://localhost:5005/api/deleteCompetence", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ person_id: model?.person_id}),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `HTTP error! Status: ${response.status}`);

            await fetchUserCompetencies(e);

            setIsApplicationUpdated(true);
            setStage("main");
            alert("Competence deleted successfully");
        } catch (error) {
            console.error("Error:", error.message);
        }
    };  

    const removeUserAvailability = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch("http://localhost:5005/api/deleteAvailability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ person_id: model?.person_id }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `HTTP error! Status: ${response.status}`);

            await fetchUserAvailability(e);
            
            setIsApplicationUpdated(true);
            setStage("main");
            alert("Availability deleted successfully");
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    const handleNext = () => {
        if (stage === "competence") {
            setStage("availability");
        } else if (stage === "availability") {
            setStage("summary");
        }
    };

    const handleBack = () => {
        if (stage === "competence") {
            setStage("main");
        } else if (stage === "availability") {
            setStage("competence");
        } else if (stage === "summary") {
            setStage("availability");
        }
    };

    useEffect(() => {
        if (isApplicationUpdated) {
            // alert("Application updated successfully!");
            setIsApplicationUpdated(false); // Reset the state
        }
    }, [isApplicationUpdated]);

    return (
        <div className="flex flex-col w-full h-full p-8 bg-gray-50">
            {/* Header Section */}
            <div className="flex justify-between items-center w-full mb-8 bg-white p-6 rounded-xl shadow-sm">
                <h1 className="text-3xl font-bold text-gray-800">
                    {stage === "main" ? "Current Application" : 
                     stage === "competence" || stage === "availability" ? "Updating Your Application" : 
                     "Application Summary"}
                </h1>
                {stage === "main" && (
                    <button
                        onClick={handleCreateNewApplication}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                        Create New Application
                    </button>
                )}
            </div>

            {/* Main Stage */}
            {stage === "main" && (
                <div className="grid grid-cols-1 gap-8 w-full">
                    {/* User Profile Section */}
                    <div className="p-6 bg-white rounded-xl shadow-sm">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Profile</h2>
                        {model?.name ? (
                            <div className="space-y-4">
                                <p className="text-gray-700"><strong>Name:</strong> {model.name}</p>
                                <p className="text-gray-700"><strong>Surname:</strong> {model.surname}</p>
                                <p className="text-gray-700"><strong>Email:</strong> {model.email}</p>
                                <p className="text-gray-700"><strong>Username:</strong> {model.username}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500">No user data available.</p>
                        )}
                    </div>

                    {/* Competence & Availability Section */}
                    <div className="grid grid-cols-2 gap-8">
                        {/* Competence Section */}
                        <div className="p-6 bg-white rounded-xl shadow-sm">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Competence</h2>
                            <button
                                onClick={fetchUserCompetencies}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300">
                                Fetch Competencies
                            </button>
                            <button
                                onClick={removeUserCompetence}
                                className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300">
                                Delete Availability
                            </button>
                            <div className="mt-4 space-y-2">
                                {userCompetencies.length > 0 ? (
                                    userCompetencies.map((competence, index) => (
                                        <div key={index} className="p-3 bg-gray-100 rounded-lg">
                                            <p className="text-gray-700">{competence.competence_name}: {competence.years_of_experience} year(s)</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No competencies found.</p>
                                )}
                            </div>
                        </div>

                        {/* Availability Section */}
                        <div className="p-6 bg-white rounded-xl shadow-sm">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Availability</h2>
                            <button
                                onClick={fetchUserAvailability}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300">
                                Fetch Availability
                            </button>
                            <button
                                onClick={removeUserAvailability}
                                className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300">
                                Delete Availability
                            </button>
                            <div className="mt-4 space-y-2">
                                {userAvailability.length > 0 ? (
                                    userAvailability.map((availability, index) => (
                                        <div key={index} className="p-3 bg-gray-100 rounded-lg">
                                            <p className="text-gray-700">{availability.from_date} - {availability.to_date}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No availability found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Competence Stage */}
            {stage === "competence" && (
    <div className="p-6 bg-white rounded-xl shadow-sm w-2/3 mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Set Competence</h2>

        {/* Competence Selection Dropdown */}
        <div className="mb-6">
            <select
                value={selectedCompetence}
                onChange={(e) => setSelectedCompetence(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-lg"
            >
                <option value="" disabled>Select Competence</option>
                {competencies.map((competence, index) => (
                    <option key={index} value={competence.name} className="text-lg">
                        {competence.name}
                    </option>
                ))}
            </select>
        </div>

        {/* Add Competence Button */}
        <button
            onClick={() => {
                if (selectedCompetence) {
                    setUserCompetencies([...userCompetencies, { 
                        competence: selectedCompetence, 
                        yearsOfExperience: 0,  // Store as number
                        yearsOfExperienceStr: "0"  // Store as string for input
                    }]);
                    setSelectedCompetence("");
                }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 mb-6">
            Add Competence
        </button>

        {/* List of Selected Competencies */}
        <div className="space-y-4">
            {userCompetencies.map((competence, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                    <span className="text-gray-700 text-lg">{competence.competence}</span>
                    <input
                        type="number"
                        step="0.1" // Allow increments/decrements of 0.1 (one decimal place)
                        min="0"
                        value={competence.yearsOfExperienceStr ?? ""}
                        onChange={(e) => {
                            const updatedCompetencies = [...userCompetencies];
                            // Store raw string value
                            updatedCompetencies[index].yearsOfExperienceStr = e.target.value;
                            // Parse float for validation
                            updatedCompetencies[index].yearsOfExperience = parseFloat(e.target.value) || 0;
                            
                            setUserCompetencies(updatedCompetencies);
                }}
                className="w-20 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                placeholder="Years"
/>
                    <button
                        onClick={() => {
                            const updatedCompetencies = userCompetencies.filter((_, i) => i !== index);
                            setUserCompetencies(updatedCompetencies);
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300">
                        Remove
                    </button>
                </div>
            ))}
        </div>

        {/* Error Message for Invalid Years of Experience */}
        {userCompetencies.some(comp => comp.yearsOfExperience === 0) && (
            <p className="text-red-500 mt-4">Please provide the years of experience for all competencies or remove them.</p>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
            <button
                onClick={handleBack}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-300">
                Back
            </button>
            <button
                onClick={() => {
                    // Check if any competency has 0 years of experience
                    if (userCompetencies.some(comp => comp.yearsOfExperience === 0)) {
                        alert("Please provide the years of experience for all competencies or remove them.");
                    } else {
                        handleNext();
                    }
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                Next
            </button>
        </div>
    </div>
)}
            {/* Availability Stage */}
            {stage === "availability" && (
                <div className="p-6 bg-white rounded-xl shadow-sm w-2/3 mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Set Availability</h2>

                    {/* From Date Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                        <input
                            type="date"
                            value={selectedAvailability.fromDate || ""}
                            onChange={(e) => setSelectedAvailability({ ...selectedAvailability, fromDate: e.target.value })}
                            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* To Date Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                        <input
                            type="date"
                            value={selectedAvailability.toDate || ""}
                            onChange={(e) => setSelectedAvailability({ ...selectedAvailability, toDate: e.target.value })}
                            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Error Message */}
                    {selectedAvailability.fromDate && selectedAvailability.toDate &&
                        new Date(selectedAvailability.fromDate) > new Date(selectedAvailability.toDate) && (
                            <p className="text-red-500 mb-4">Error: "From Date" cannot be later than "To Date".</p>
                        )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <button
                            onClick={handleBack}
                            className="px-6 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-300">
                            Back
                        </button>
                        <button
                            onClick={() => {
                                if (new Date(selectedAvailability.fromDate) > new Date(selectedAvailability.toDate)) {
                                    alert("Error: 'From Date' cannot be later than 'To Date'.");
                                } else {
                                    handleNext();
                                }
                            }}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Summary Stage */}
            {stage === "summary" && (
                <div className="p-6 bg-white rounded-xl shadow-sm w-2/3 mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Application Summary</h2>

                    {/* User Profile Summary */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">User Profile</h3>
                        <div className="space-y-2">
                            <p className="text-gray-700"><strong>Name:</strong> {model?.name}</p>
                            <p className="text-gray-700"><strong>Surname:</strong> {model?.surname}</p>
                            <p className="text-gray-700"><strong>Email:</strong> {model?.email}</p>
                            <p className="text-gray-700"><strong>Username:</strong> {model?.username}</p>
                        </div>
                    </div>

                    {/* Competence Summary */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Competence</h3>
                        {userCompetencies.length > 0 ? (
                            userCompetencies.map((competence, index) => (
                                <div key={index} className="p-3 bg-gray-100 rounded-lg mb-2">
                                    <p className="text-gray-700">{competence.competence}: {competence.yearsOfExperience} year(s)</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No competencies selected.</p>
                        )}
                    </div>

                    {/* Availability Summary */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Availability</h3>
                        {selectedAvailability.fromDate && selectedAvailability.toDate ? (
                            <div className="p-3 bg-gray-100 rounded-lg">
                                <p className="text-gray-700">{selectedAvailability.fromDate} to {selectedAvailability.toDate}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500">No availability entered.</p>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <button
                            onClick={handleBack}
                            className="px-6 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-300">
                            Back
                        </button>
                        <button
                            onClick={updateUserProfile}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                            Finish
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicantView;