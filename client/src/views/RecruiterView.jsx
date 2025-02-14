import { useState } from "react";
import applicantsData from './applicants.json';

const statusColors = {
    0: "bg-yellow-400", // Unhandled
    1: "bg-green-400", // Accepted
    2: "bg-red-400", // Rejected",
};

const statusText = {
    0: "Unhandled",
    1: "Accepted",
    2: "Rejected",
};

const RecruiterView = ({ model, applicantsModel }) => {
    const [applicants, setApplicants] = useState(applicantsModel || []);
    const [expanded, setExpanded] = useState(null);
    const [editingStatus, setEditingStatus] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [inputError, setInputError] = useState(false);

    const getApplicants = async () => {
        try {
            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/applicantProfiles", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            }
            console.log("Response:", data);
            setApplicants(data);
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    //Get applicant by ID
    const postGetApplicant = async (applicant_id) => {
        try {
            console.log("Fetching applicant by ID:", applicant_id);
    
            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/applicantProfile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ applicant_id }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            }
    
            // Ensure data is stored as an array, matching the GET request format
            console.log("Response:", data.data);
            setApplicants(data.data); // No need for [data.data] since backend now returns an array
            return data;
        } catch (error) {
            console.error("Error:", error.message);
            return { error: error.message };
        }
    };

    //Start applicant change status

    //End applicant change status

    //Reload applications

    const searchForApplicants = () => {
        if (searchTerm.trim() === "") {
            setInputError(false);
            getApplicants();
        } else if (!isNaN(searchTerm) && Number.isInteger(Number(searchTerm))) {
            setInputError(false);
            console.log(`Fetching data for ID: ${searchTerm}`);
            postGetApplicant(searchTerm);
        } else {
            setInputError(true);
        }
    };

    return (
        <div className="w-full h-full p-4 overflow-auto">
            {/* Search Bar */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Applicants</h1>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Applicant ID"
                        className={`p-2 border ${inputError ? "border-red-500" : "border-gray-400"} rounded-lg shadow-md`}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setInputError(false);
                        }}
                    />
                    <button
                        className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg"
                        onClick={searchForApplicants}
                    >
                        Search
                    </button>
                </div>
            </div>

            {inputError && <p className="text-red-500 text-sm mt-1">Invalid input. Please enter a valid number.</p>}

            {/* Applicants List */}
            <div className="space-y-2">
                {applicants.map((applicant) => (
                    <div
                        key={applicant.person_id}
                        className={`border border-gray-300 rounded-lg shadow-md p-4 cursor-pointer transition-all ${
                            expanded === applicant.person_id ? "bg-gray-100" : "bg-white"
                        }`}
                        onClick={() => setExpanded(expanded === applicant.person_id ? null : applicant.person_id)}
                    >
                        {/* Name & Status Row */}
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold">{`${applicant.person_name} ${applicant.surname}`}</p>

                            {/* Status Change Flow */}
                            <div className="flex items-center gap-2">
                                {editingStatus === applicant.person_id ? (
                                    <>
                                        <select
                                            className="p-1 border rounded shadow-md"
                                            value={selectedStatus ?? applicant.status}
                                            onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
                                            onClick={(e) => e.stopPropagation()} // Prevent row toggle when clicking dropdown
                                        >
                                            {Object.entries(statusText).map(([key, text]) => (
                                                <option key={key} value={key}>
                                                    {text}
                                                </option>
                                            ))}
                                        </select>

                                        <button
                                            className="bg-green-500 hover:bg-green-400 text-white px-3 py-1 rounded-lg shadow"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent row toggle
                                                console.log(`Confirmed status change: ${selectedStatus}`);
                                                setEditingStatus(null);
                                                setSelectedStatus(null);
                                                // Handle API update here
                                            }}
                                        >
                                            Confirm
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <p className="mr-2 font-bold">{statusText[applicant.status]}</p>
                                        <div className={`w-5 h-5 rounded-full ${statusColors[applicant.status]}`}></div>
                                        {/* Show "Change" button only when expanded */}
                                        {expanded === applicant.person_id && (
                                            <button
                                                className="ml-2 border border-gray-600 px-2 py-1 rounded-md shadow"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent row toggle
                                                    setEditingStatus(applicant.person_id);
                                                }}
                                            >
                                                Change
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {expanded === applicant.person_id && (
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                {/* Competencies (Left Side) */}
                                <div className="bg-white shadow-md rounded-lg p-4">
                                    <h2 className="font-semibold text-lg mb-2">Competencies</h2>
                                    <ul className="list-disc pl-4">
                                        {applicant.competencies.map((comp, index) => (
                                            <li key={index} className="text-sm">
                                                {comp.competence_name} ({comp.years_of_experience} years)
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Availability (Right Side) */}
                                <div className="bg-white shadow-md rounded-lg p-4">
                                    <h2 className="font-semibold text-lg mb-2">Availability</h2>
                                    {applicant.availability.length > 0 ? (
                                        <ul className="list-disc pl-4">
                                            {applicant.availability.map((period, index) => (
                                                <li key={index} className="text-sm">{`${period[0]} - ${period[1]}`}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500">No availability</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecruiterView;
