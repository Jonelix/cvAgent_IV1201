import React, { useState } from "react";
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
    const [selectedAvailability, setSelectedAvailability] = useState(""); // Store selected availability
    const [userAvailability, setUserAvailability] = useState([]);

    const handleCreateNewApplication = () => {
        setStage("competence"); // Move to the competence stage
    };


    const fetchCompetencies = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/competencies");
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            setCompetencies(data);
        }catch (error) {
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
        try{
            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/userAvailability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ person_id: model?.person_id }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            setUserAvailability(data);
        }catch (error) {
            console.error("Error:", error.message);
        }

    };

    const handleNext = () => {
        if (stage === "competence") {
            setStage("availability"); // Move to the availability stage
        } else if (stage === "availability") {
            setStage("summary"); // Move to the summary stage
        }
    };

    const handleBack = () => {
        if (stage === "competence") {
            setStage("main"); // Go back to the main stage
        } else if (stage === "availability") {
            setStage("competence"); // Go back to the competence stage
        } else if (stage === "summary") {
            setStage("availability"); // Go back to the availability stage
        }
    };

    const handleFinish = () => {
        alert("Application submitted!"); // Show submission message
        setStage("main"); // Reset to the main stage
    };

    return (
        <div className="flex flex-col w-full h-full p-6 bg-gray-100">
            {/* Header Section */}
            {stage === "main" ? (
                <div className="flex justify-between items-center w-full mb-6 bg-white p-4 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-gray-700">Current Application</h1>
                    <button 
                        onClick={handleCreateNewApplication} 
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                        Create New Application
                    </button>
                </div>
            ) : (
                <div className="flex justify-between items-center w-full mb-6 bg-white p-4 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-gray-700">
                        {stage === "competence" || stage === "availability" 
                            ? "Updating your application" 
                            : "Summary"}
                    </h1>
                </div>
            )}

            {/* Main Layout */}
            {stage === "main" && (
                <div className="grid grid-rows-3 gap-6 w-full">
                    {/* Person Section */}
                    <div className="p-4 border rounded-lg shadow-md bg-white w-1/3">
                        <h2 className="text-xl font-bold">User Profile </h2>
                    
                    {/* Display User Data */}

                    {model?.name != null ? (
                        <div className="mb-6">
                        <div className="space-y-2">
                        <p><strong>Name:</strong> {model?.name}</p>
                        <p><strong>Surname:</strong> {model?.surname}</p>
                        <p><strong>Email:</strong> {model?.email}</p>
                        <p><strong>Username:</strong> {model?.username}</p>
                        {/*console.log(model)*/}

                        </div>
                    </div>) :(<p className="text-gray-500 mt-2">(Person details will be displayed here)</p>)
                }
                    </div>
                    
                    {/* Competence & Availability Section */}
                    <div className="grid grid-cols-2 gap-6 w-full">
                        {/* Competence Section */}
                        <div className="p-4 border rounded-lg shadow-md bg-white">
                            <h2 className="text-xl font-bold">Competence</h2>
                            <button 
                                onClick={fetchUserCompetencies} 
                                className="mt-2 px-3 py-1 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition">
                                Fetch user cometencies
                            </button>
                            {/*console.log("HERE: " , userCompetencies)*/}

                            {userCompetencies.length > 0 ? (
                                userCompetencies.map((competence, index) => (
                                <p key={index} className="mt-2 p-2 bg-gray-100 rounded-lg shadow-sm">{competence?.competence_name} : {competence?.years_of_experience} year(s)</p>
                                ))) : ( <p className="text-gray-500 mt-2">(No competencies found in the database)</p>)
                            }
                        </div>
                        
                        {/* Availability Section */}
                <div className="p-4 border rounded-lg shadow-md bg-white">
                <h2 className="text-xl font-bold">Availability</h2>
    
                <button 
                    onClick={fetchUserAvailability} 
                    className="mt-2 px-3 py-1 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition">
                    Fetch user availability
                </button>

                <div>{/*console.log("ava: ", userAvailability)*/}</div>

                {userAvailability.length > 0 ? (
                    userAvailability.map((availability, index) => (
                        <p key={index} className="mt-2 p-2 bg-gray-100 rounded-lg shadow-sm">
                            {availability.from_date} - {availability.to_date}
                        </p>
                    ))
                ) : (
                    <p className="text-gray-500 mt-2">(No user availability found in the database)</p>
                )}
            </div>

            </div>
            </div>
        )}

            {/* Competence Stage */}
            {stage === "competence" && (
                <div className="p-4 border rounded-lg shadow-md bg-white w-1/2 mx-auto">
                    <button 
                    onClick={fetchCompetencies} 
                    className="mt-2 px-3 py-1 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition">
                        Refresh competencies    
                    </button>

                    <h2 className="text-xl font-semibold text-gray-800">Set Competence</h2>
                    <select
                        value={selectedCompetence}
                        onChange={(e) => setSelectedCompetence(e.target.value)}
                        className="mt-2 w-full p-2 border rounded-lg shadow-sm"
                    >
                        <option value="">Select Competence</option>
                        {competencies.map((competence, index) => (
                            <option key={index} value={competence?.name}>{competence?.name}</option>
                        ))}
                    </select>
                    <div className="flex justify-between mt-4">
                        <button 
                            onClick={handleBack} 
                            className="px-4 py-2 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 transition">
                            Back
                        </button>
                        <button 
                            onClick={handleNext} 
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Availability Stage */}
            {stage === "availability" && (
                <div className="p-4 border rounded-lg shadow-md bg-white w-1/2 mx-auto">
                    <h2 className="text-xl font-semibold text-gray-800">Set Availability</h2>
                    <input
                        type="text"
                        value={selectedAvailability}
                        onChange={(e) => setSelectedAvailability(e.target.value)}
                        placeholder="Enter availability"
                        className="mt-2 w-full p-2 border rounded-lg shadow-sm"
                    />
                    <div className="flex justify-between mt-4">
                        <button 
                            onClick={handleBack} 
                            className="px-4 py-2 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 transition">
                            Back
                        </button>
                        <button 
                            onClick={handleNext} 
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Summary Stage */}
            {stage === "summary" && (
                <div className="grid grid-rows-3 gap-6 w-full">
                    {/* Person Section */}
                    <div className="p-4 border rounded-lg shadow-md bg-white w-1/3">
                        <h2 className="text-xl font-semibold text-gray-800">Person</h2>
                        {person.length > 0 ? (
                            <ul className="mt-4 text-gray-700">
                                {person.map((p, index) => (
                                    <li key={index} className="mb-2 p-2 bg-gray-100 rounded-lg shadow-sm">{p.name}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 mt-2">(Person details will be displayed here)</p>
                        )}
                    </div>
                    
                    {/* Competence & Availability Section */}
                    <div className="grid grid-cols-2 gap-6 w-full">
                        {/* Competence Section */}
                        <div className="p-4 border rounded-lg shadow-md bg-white">
                            <h2 className="text-xl font-semibold text-gray-800">Competence</h2>
                            {selectedCompetence ? (
                                <p className="mt-4 text-gray-700 p-2 bg-gray-100 rounded-lg shadow-sm">{selectedCompetence}</p>
                            ) : (
                                <p className="text-gray-500 mt-2">(No competence selected)</p>
                            )}
                        </div>
                        
                        {/* Availability Section */}
                        <div className="p-4 border rounded-lg shadow-md bg-white">
                            <h2 className="text-xl font-semibold text-gray-800">Availability</h2>
                            {selectedAvailability ? (
                                <p className="mt-4 text-gray-700 p-2 bg-gray-100 rounded-lg shadow-sm">{selectedAvailability}</p>
                            ) : (
                                <p className="text-gray-500 mt-2">(No availability entered)</p>
                            )}
                        </div>
                    </div>

                    {/* Buttons for Summary Stage */}
                    <div className="flex justify-between mt-6">
                        <button 
                            onClick={handleBack} 
                            className="px-4 py-2 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 transition">
                            Back
                        </button>
                        <button 
                            onClick={handleFinish} 
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                            Finish
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicantView;