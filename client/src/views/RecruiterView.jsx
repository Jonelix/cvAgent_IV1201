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
    const [searchTerm, setSearchTerm] = useState("");
    const [inputError, setInputError] = useState(false);
    const [editingStatus, setEditingStatus] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

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

    //Get specific applicant

    //

    const searchForApplicants = () => {
        if (searchTerm.trim() === "") {
            setInputError(false);
            getApplicants();
        } else if (!isNaN(searchTerm) && Number.isInteger(Number(searchTerm))) {
            setInputError(false);
            console.log(`Fetching data for ID: ${searchTerm}`);
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
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg"
                        onClick={searchForApplicants}
                    >
                        Search
                    </button>
                </div>
            </div>

            {inputError && <p className="text-red-500 text-sm mt-1">Invalid input. Please enter a valid number.</p>}

            {/* Applicants Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-2 px-4 text-left">Name</th>
                            <th className="py-2 px-4 text-left">Competencies</th>
                            <th className="py-2 px-4 text-left">Availability</th>
                            <th className="py-2 px-4 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applicants.map((applicant) => (
                            <tr key={applicant.person_id} className="border-b hover:bg-gray-100">
                                {/* Name */}
                                <td className="py-2 px-4 font-semibold">{`${applicant.person_name} ${applicant.surname}`}</td>

                                {/* Competencies */}
                                <td className="py-2 px-4">
                                    <ul className="list-disc pl-4">
                                        {applicant.competencies.map((comp, index) => (
                                            <li key={index} className="text-sm">
                                                {comp.competence_name} ({comp.years_of_experience} years)
                                            </li>
                                        ))}
                                    </ul>
                                </td>

                                {/* Availability */}
                                <td className="py-2 px-4">
                                    {applicant.availability.length > 0 ? (
                                        <ul className="list-disc pl-4 text-sm">
                                            {applicant.availability.map((period, index) => (
                                                <li key={index}>{`${period[0]} - ${period[1]}`}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 text-sm">No availability</p>
                                    )}
                                </td>

                                {/* Status Change Flow */}
                                <td className="py-2 px-4">
                                    {editingStatus === applicant.person_id ? (
                                        <div className="flex items-center gap-2">
                                            {/* Dropdown */}
                                            <select
                                                className="p-1 border rounded shadow-md"
                                                value={selectedStatus ?? applicant.status}
                                                onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
                                            >
                                                {Object.entries(statusText).map(([key, text]) => (
                                                    <option key={key} value={key}>
                                                        {text}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Confirm Button */}
                                            <button
                                                className="bg-green-500 hover:bg-green-400 text-white px-3 py-1 rounded-lg shadow"
                                                onClick={() => {
                                                    console.log(`Confirmed status change: ${selectedStatus}`);
                                                    setEditingStatus(null);
                                                    setSelectedStatus(null);
                                                    // Handle API update here
                                                }}
                                            >
                                                Confirm
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <p className="mr-2 font-bold">{statusText[applicant.status]}</p>
                                            <div className={`w-5 h-5 rounded-full ${statusColors[applicant.status]}`}></div>

                                            {/* Change Button */}
                                            <button
                                                className="ml-2 border border-gray-600 px-2 py-1 rounded-md shadow"
                                                onClick={() => setEditingStatus(applicant.person_id)}
                                            >
                                                Change
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecruiterView;
