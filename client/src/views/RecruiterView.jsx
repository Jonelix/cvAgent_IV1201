import { set } from "mobx";
import { useState, useEffect } from "react";

const statusColors = {
    0: "bg-yellow-400", // Unhandled
    1: "bg-green-400", // Accepted
    2: "bg-red-400",   // Rejected
};

/**
 * RecruiterView Component - Manages the display and handling of applicants for recruiters.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.model - User model containing recruiter information
 * @param {Object} props.applicantsModel - Model containing applicants data
 * @param {Object} props.strings - Localization strings for UI text
 * 
 * @returns {JSX.Element} RecruiterView component
 */
const RecruiterView = ({ model, applicantsModel, strings }) => {
    const statusText = {
        0: strings.unhandled || "Unhandled",
        1: strings.accepted || "Accepted",
        2: strings.rejected || "Rejected",
    };

    const [applicants, setApplicants] = useState(applicantsModel.applicants || []);
    const [expanded, setExpanded] = useState(null);
    const [editingStatus, setEditingStatus] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [inputError, setInputError] = useState(false);

    // --- Pagination states ---
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // or make this selectable if you wish
    const [pageInput, setPageInput] = useState("1");

    const currentRecruiter = model.person_id || null;

    /**
     * Updates applicants when `applicantsModel` changes.
     */
    useEffect(() => {
        setApplicants(applicantsModel.applicants || []);
        setCurrentPage(1);
        setPageInput("1");
    }, [applicantsModel.applicants]);

    /**
     * If editing status changes, sends request to backend to handle applicant status.
     */
    useEffect(() => {
        if (editingStatus !== null) {
            postHandleApplicantStatus();
        }
    }, [editingStatus]);

    /**
     * Fetches all applicants from the backend.
     */
    const getApplicants = async () => {
        try {
            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/applicantProfiles", {
            //const response = await fetch("http://localhost:5005/api/applicantProfiles", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            }
            console.log("Response:", data);
            setApplicants(data);
            // Reset pagination after fetching
            setCurrentPage(1);
            setPageInput("1");
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

     /**
     * Fetches a specific applicant by their ID.
     * 
     * @param {number} applicant_id - The applicant's ID
     * @returns {Promise<Object>} API response data
     */
    const postGetApplicant = async (applicant_id) => {
        try {
            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/applicantProfile", {
            //const response = await fetch("http://localhost:5005/api/applicantProfile", {
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

            console.log("Response:", data.data);
            setApplicants(data.data);
            // Reset pagination after fetching
            setCurrentPage(1);
            setPageInput("1");
            return data;
        } catch (error) {
            console.error("Error:", error.message);
            return { error: error.message };
        }
    };

     /**
     * Sends a request to the backend to handle the status update of an applicant.
     * Generates a timestamp set to 15 minutes in the future.
     * 
     * @returns {Promise<Object>} API response data
     */
    const postHandleApplicantStatus = async () => {
        try {
            // Generate timestamp = current time + 15 minutes
            const timestamp = new Date();
            timestamp.setMinutes(timestamp.getMinutes() + 15);
            const formattedTimestamp = timestamp.toISOString().slice(0, 19).replace("T", " ");

            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/handleApplicantStatus", {
            //const response = await fetch("http://localhost:5005/api/handleApplicantStatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    rec_id: currentRecruiter,
                    app_id: editingStatus,
                    timestamp: formattedTimestamp,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            }

            console.log("Handling Status Response:", data);
            return data;
        } catch (error) {
            console.error("Error:", error.message);
            return { error: error.message };
        }
    };

    /**
     * Confirms and updates the status of an applicant.
     * 
     * @param {number} currentRecruiter - Recruiter ID
     * @param {number} editingStatus - Applicant ID whose status is being updated
     * @param {number} selectedStatus - New status value
     * @returns {Promise<Object>} API response data
     */
    const postConfirmStatusUpdate = async (currentRecruiter, editingStatus, selectedStatus) => {
        try {
            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/confirmStatusUpdate", {
            //const response = await fetch("http://localhost:5005/api/confirmStatusUpdate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    rec_id: currentRecruiter,
                    app_id: editingStatus,
                    status: selectedStatus,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            }

            console.log("Status Update Response:", data);
            if (searchTerm !== "") {
                postGetApplicant(searchTerm);
            } else {
                getApplicants();
            }
            return data;
        } catch (error) {
            console.error("Error:", error.message);
            return { error: error.message };
        }
    };

    /**
     * Searches for applicants based on input criteria.
     */
    const searchForApplicants = () => {
        if (searchTerm.trim() === "") {
            setInputError(false);
            getApplicants();
        } else if (!isNaN(searchTerm) && Number.isInteger(Number(searchTerm))) {
            setInputError(false);
            postGetApplicant(searchTerm);
        } else {
            setInputError(true);
        }
    };

    // ---- Local Pagination Logic ----
    // 1) figure out how many pages exist
    const totalPages = Math.ceil(applicants.length / itemsPerPage);

    // 2) slice the applicants array to get applicants for the current page
    const indexOfLastApplicant = currentPage * itemsPerPage;
    const indexOfFirstApplicant = indexOfLastApplicant - itemsPerPage;
    const currentApplicants = applicants.slice(indexOfFirstApplicant, indexOfLastApplicant);

    /**
     * Moves to the previous page in pagination.
     */
    const handlePrevPage = () => {
        setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));
        setPageInput((prev) => String(Math.max(1, Number(prev) - 1)));
    };

    /**
     * Moves to the next page in pagination.
     */
    const handleNextPage = () => {
        setCurrentPage((prev) => (prev < totalPages ? prev + 1 : totalPages));
        setPageInput((prev) => String(Math.min(totalPages, Number(prev) + 1)));
    };

    /**
     * Jumps to a specific page based on user input.
     */
    const goToPage = () => {
        const pageNum = Number(pageInput);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
        } else {
            // Reset to 1 or last page if out of range – or simply ignore
            alert(`Please enter a valid page number between 1 and ${totalPages}`);
        }
    };

    return (
        <div className="w-full h-full p-4 overflow-auto">
            {/* Search Bar */}
            {/* UI rendering logic here */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{strings.applicants}</h1>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder={strings.applicant_id}
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
                        {strings.search}
                    </button>
                </div>
            </div>

            {inputError && <p className="text-red-500 text-sm mt-1">Invalid input. Please enter a valid number.</p>}

            {/* Applicants List */}
            <div className="space-y-2">
                {currentApplicants.map((applicant) => (
                    <div
                        key={applicant.person_id}
                        className={`border border-gray-300 rounded-lg shadow-md p-4 cursor-pointer transition-all ${
                            expanded === applicant.person_id ? "bg-gray-100" : "bg-white"
                        }`}
                        onClick={() => setExpanded(expanded === applicant.person_id ? null : applicant.person_id)}
                    >
                        {/* Name & Status Row */}
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold">
                                {`${applicant.person_name} ${applicant.surname}`}
                            </p>

                            {/* Status Change Flow */}
                            <div className="flex items-center gap-2">
                                {editingStatus === applicant.person_id ? (
                                    <>
                                        <select
                                            className="p-1 border rounded shadow-md"
                                            value={selectedStatus ?? applicant.status}
                                            onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
                                            onClick={(e) => e.stopPropagation()}
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
                                                e.stopPropagation();
                                                postConfirmStatusUpdate(
                                                    currentRecruiter,
                                                    editingStatus,
                                                    selectedStatus
                                                );
                                                setEditingStatus(null);
                                                setSelectedStatus(null);
                                                setExpanded(null);
                                            }}
                                        >
                                            {strings.confirm}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <p className="mr-2 font-bold">{statusText[applicant.status]}</p>
                                        <div
                                            className={`w-5 h-5 rounded-full ${statusColors[applicant.status]}`}
                                        ></div>
                                        {expanded === applicant.person_id && (
                                            <button
                                                className="ml-2 border border-gray-600 px-2 py-1 rounded-md shadow"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingStatus(applicant.person_id);
                                                    setSelectedStatus(applicant.status);
                                                }}
                                            >
                                                {strings.change}
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
                                    <h2 className="font-semibold text-lg mb-2">{strings.competence}</h2>
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
                                    <h2 className="font-semibold text-lg mb-2">{strings.availability}</h2>
                                    {applicant.availability.length > 0 ? (
                                        <ul className="list-disc pl-4">
                                            {applicant.availability.map((period, index) => (
                                                <li key={index} className="text-sm">
                                                    {`${period[0]} - ${period[1]}`}
                                                </li>
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

            {/* -- Pagination Controls -- */}
            {applicants.length > 0 && (
                <div className="flex justify-center items-center mt-4 gap-2">
                    <button
                        onClick={handlePrevPage}
                        className="border border-gray-400 p-2 rounded-md"
                        disabled={currentPage === 1}
                    >
                        {strings.prev || "Prev"}
                    </button>

                    <div>
                        <input
                            type="number"
                            className="border p-2 w-16 text-center rounded-md"
                            value={pageInput}
                            onChange={(e) => setPageInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    goToPage();
                                }
                            }}
                        />
                        <span className="ml-2">
                            / {totalPages} {strings.pages || "pages"}
                        </span>
                    </div>

                    <button
                        onClick={handleNextPage}
                        className="border border-gray-400 p-2 rounded-md"
                        disabled={currentPage === totalPages}
                    >
                        {strings.next || "Next"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default RecruiterView;
