import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

/**
 * ApplicantView Component - Manages user application process including competencies, availabilities, and profile summary.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.model - User model containing personal information
 * @param {Object} props.strings - Localization strings for UI text
 * 
 * @returns {JSX.Element} ApplicantView component
 */
const competenceLocalization = {
    "ticket sales": {
      en: "Ticket sales",
      es: "Venta de entradas"
    },
    "lotteries": {
      en: "Lotteries",
      es: "Loterías"
    },
    "roller coaster operation": {
      en: "Roller coaster operation",
      es: "Operación de montañas rusas"
    },
    // Add more competence names here...
  };


const ApplicantView = ({ model, strings }) => {
    const navigate = useNavigate();

    /** State Hooks */
    const [competencies, setCompetencies] = useState([]);
    const [userCompetencies, setUserCompetencies] = useState([]);
    const [newCopetence, setNewCompetence] = useState([]);
    const [newExperience, setNewExperience] = useState([]);
    const [person, setPerson] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [stage, setStage] = useState("main"); // Track current stage: "main", "competence", "availability", "summary"
    const [selectedCompetence, setSelectedCompetence] = useState(""); // Store selected competence
    const [availabilities, setAvailabilities] = useState([]); // Array to store multiple availabilities
    const [newAvailability, setNewAvailability] = useState({ from_date: "", to_date: "" }); // Temporary state for the current inpu
    const [userAvailability, setUserAvailability] = useState([]);
    const [isApplicationUpdated, setIsApplicationUpdated] = useState(false); // Track if application is updated
    const [error, setError] = useState("");
    const [alertmsg, setAlertmsg] = useState("");
    /**
     * Navigates to the competence stage when creating a new application.
     */
    const handleCreateNewApplication = () => {
        setStage("competence"); // Move to the competence stage
    };

    /**
     * Checks if a new availability period overlaps with existing ones.
     * 
     * @param {string} newFromDate - Start date of new availability
     * @param {string} newToDate - End date of new availability
     * @returns {boolean} True if overlapping, otherwise false
     */
    const isOverlapping = (newFromDate, newToDate) => {
        const newFrom = new Date(newFromDate);
        const newTo = new Date(newToDate);

        return availabilities.some((availability) => {
            const existingFrom = new Date(availability.from_date);
            const existingTo = new Date(availability.to_date);

            return (
                (newFrom >= existingFrom && newFrom <= existingTo) || // New start date is within an existing period
                (newTo >= existingFrom && newTo <= existingTo) || // New end date is within an existing period
                (newFrom <= existingFrom && newTo >= existingTo) // New period completely overlaps an existing period
            );
        });
    };
     /**
     * Fetches competencies, user competencies, and user availability based on the stage.
     */
    useEffect(() => {
        if (stage === "main") {
            fetchUserCompetencies();
            fetchUserAvailability();
        } else if (stage === "competence") {
            fetchCompetencies();
            fetchUserCompetencies();
        }else if(stage === "availability"){
            fetchUserAvailability();
        }
    }, [stage]);

    /**
     * Fetches available competencies from API.
     */
    const fetchCompetencies = async () => {
        try {
            // const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/competencies");
            const response = await fetch("http://localhost:5005/api/competencies");
            const data = await response.json();
            // if (!response.ok) throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            if(!response.ok){throw new Error(data.message || "Failed to fetch competencies");}
            setCompetencies(data);
        } catch (error) {
            console.error("Error:", error.message);
            setError(error.message);
        }
    };

    /**
     * Fetches user's competencies from API.
     */
    const fetchUserCompetencies = async () => {
        try {
            // const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/userCompetencies", {
            const response = await fetch("http://localhost:5005/api/userCompetencies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ person_id: model?.person_id }),
            });
            const data = await response.json();
            // if (!response.ok) throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            if(!response.ok){throw new Error(data.message || "Failed to fetch user competencies");}
            setUserCompetencies(data);
        } catch (error) {
            console.error("Error:", error.message);
            setError(error.message);
        }
    };
     /**
     * Fetches user's availability periods from API.
     */
    const fetchUserAvailability = async () => {
        try {
            // const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/userAvailability", {
            const response = await fetch("http://localhost:5005/api/userAvailability", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: 'include',
              body: JSON.stringify({
                person_id: model?.person_id,
                cookie: model?.cookie ?? null // Send null if cookie is undefined
              })
            });
            const data = await response.json();
            //if (!response.ok) throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            if(!response.ok){throw new Error(data.message || "Failed to fetch user availability");}
            setUserAvailability(data);
            setAvailabilities(data);
        } catch (error) {
            console.error("Error:", error.message);
            setError(error.message);
        }
    };
    /**
     * Updates user profile by sending competencies and availabilities to API.
     * 
     * @param {Event} e - Form submission event
     */
    const updateUserProfile = async (e) => {
        e.preventDefault();
        try {
            console.log("userAvailability: ", userAvailability);
            console.log("availabilities: ", availabilities);
            // const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/createApplication", {
            const response = await fetch("http://localhost:5005/api/createApplication", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    person_id: model?.person_id,
                    competencies: userCompetencies,  // Send all competencies
                    availabilities: availabilities,  // Send all availabilities
                }),
            });

            const data = await response.json();
            console.log("hello")
            // if (!response.ok) throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            if(!response.ok){throw new Error(data.message || "Failed to update user profile");}


            if(data.message) {
                alert(data.message);                               
                await fetchUserCompetencies(e);
                await fetchUserAvailability(e);
                setIsApplicationUpdated(true);
                setStage("main");
            }
        } catch (error) {
            console.error("Error:", error.message);
            setError(error.message);
        }
    };
    /**
     * Removes a user competence from the database.
     * 
     * @param {Event} e - Click event
     */
    const removeUserCompetence = async (e) => {
        e.preventDefault();
        try{
            // const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/deleteCompetence", {
            const response = await fetch("http://localhost:5005/api/deleteCompetence", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ person_id: model?.person_id}),
            });

            const data = await response.json();
            // if (!response.ok) throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            if(!response.ok){throw new Error(data.message || "Failed to delete competence");}
            await fetchUserCompetencies(e);

            setIsApplicationUpdated(true);
            setStage("main");
            alert(strings.competence_deleted);
        } catch (error) {
            console.error("Error:", error.message);
            setError(error.message);
        }
    };
    /**
     * Removes a user availability period from the database.
     * 
     * @param {Event} e - Click event
     */
    const removeUserAvailability = async (e) => {
        e.preventDefault();
        try{
            // const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/deleteAvailability", {
            const response = await fetch("http://localhost:5005/api/deleteAvailability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ person_id: model?.person_id }),
            });

            const data = await response.json();
            // if (!response.ok) throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            if(!response.ok){throw new Error(data.message || "Failed to delete availability");}

            await fetchUserAvailability(e);

            setIsApplicationUpdated(true);
            setStage("main");
            alert(strings.availability_deleted);
        } catch (error) {
            console.error("Error:", error.message);
            setError(error.message);
        }
    };

    /**
     * Cancels the user profile update process.
     */
    const cancleUserProfile = async (e) => {
        e.preventDefault();
        try{
            setUserAvailability("");
            setUserCompetencies("");
            setStage("main");

        } catch (error) {
            console.error("Error:", error.message);
            setError(error.message);
        }
    }

    /**
     * Handles navigation to the next stage in the application process.
     */
    const handleNext = () => {
        if (stage === "competence") {
            setError(null); // Clear any previous error messages
            setStage("availability");
        } else if (stage === "availability") {
            setError(null); // Clear any previous error messages
            setStage("summary");
        }
    };

    /**
     * Handles navigation to the previous stage in the application process.
     */
    const handleBack = () => {
        if (stage === "competence") {
            setError(null); // Clear any previous error messages
            setStage("main");
        } else if (stage === "availability") {
            setError(null); // Clear any previous error messages
            setStage("competence");
        } else if (stage === "summary") {
            setError(null); // Clear any previous error messages
            setStage("availability");
        }
    };
    
    /**
     * Resets the `isApplicationUpdated` state when the application is updated.
     */
    useEffect(() => {
        if (isApplicationUpdated) {
            // alert("Application updated successfully!");
            setIsApplicationUpdated(false); // Reset the state
        }
    }, [isApplicationUpdated]);

    return (
        <div className="flex flex-col w-full h-full p-8 bg-gray-50">
            {/* Header Section */}
            {/* Component UI here */}
            <div className="flex justify-between items-center w-full mb-8 bg-white p-6 rounded-xl shadow-sm">
                <h1 className="text-3xl font-bold text-gray-800">
                    {stage === "main" ? strings.current_application :
                     stage === "competence" || stage === "availability" ? strings.updating_your_application :
                     strings.application_summary}
                </h1>
                {stage === "main" && (
                    <button
                        onClick={handleCreateNewApplication}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                        {strings.update_application}
                    </button>
                )}
            </div>

            {/* Main Stage */}
            {stage === "main" && (
                <div className="grid grid-cols-1 gap-8 w-full">
                    {/* User Profile Section */}
                    <div className="p-6 bg-white rounded-xl shadow-sm">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{strings.user_profile}</h2>
                        {model?.name ? (
                            <div className="space-y-4">
                                <p className="text-gray-700"><strong>{strings.first_name}</strong> {model.name}</p>
                                <p className="text-gray-700"><strong>{strings.last_name}</strong> {model.surname}</p>
                                <p className="text-gray-700"><strong>{strings.email}</strong> {model.email}</p>
                                <p className="text-gray-700"><strong>{strings.username}</strong> {model.username}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500">{strings.no_user_data}</p>
                        )}
                    </div>

                    {/* Competence & Availability Section */}
                    <div className="grid grid-cols-2 gap-8">
                        {/* Competence Section */}
                        <div className="p-6 bg-white rounded-xl shadow-sm">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{strings.competence}</h2>

                            <button
                                onClick={removeUserCompetence}
                                className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300">
                                {strings.delete_competencies}
                            </button>
                            <div className="mt-4 space-y-2">
                                {userCompetencies.length > 0 ? (
                                    userCompetencies.map((competence, index) => (
                                        <div key={index} className="p-3 bg-gray-100 rounded-lg">
                                            <p className="text-gray-700">{competenceLocalization[competence.competence_name][model.language] || competence.competence_name}: {competence.years_of_experience} {strings.years}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">{strings.no_competencies}</p>
                                )}
                            </div>
                        </div>

                        {/* Availability Section */}
                        <div className="p-6 bg-white rounded-xl shadow-sm">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{strings.availability}</h2>
                            <button
                                onClick={removeUserAvailability}
                                className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300">
                                {strings.delete_availability}
                            </button>
                            <div className="mt-4 space-y-2">
                                {userAvailability.length > 0 ? (
                                    userAvailability.map((availability, index) => (
                                        <div key={index} className="p-3 bg-gray-100 rounded-lg">
                                            <p className="text-gray-700">{availability.from_date} - {availability.to_date}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">{strings.no_availability}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Competence Stage */}
            {stage === "competence" && (
    <div className="p-6 bg-white rounded-xl shadow-sm w-2/3 mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">{strings.set_competence}</h2>

        {/* Competence Selection Dropdown */}
        <div className="mb-6">
            <select
                value={selectedCompetence}
                onChange={(e) => setSelectedCompetence(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-lg"
            >
                <option value="" disabled>{strings.select_competence}</option>
                {competencies.map((competence, index) => (
                    <option key={index} value={competence.name} className="text-lg">
                        {competenceLocalization[competence.name][model.language] || competence.name}
                    </option>
                ))}
            </select>
        </div>

        {/* Add Competence Button */}
        <button
            onClick={() => {
                
                setError(null);


                if (!selectedCompetence) {
                    setError(strings.competence_empty); // Set error if no competence is selected
                    return;
                }

                // Check if the competence already exists in userCompetencies
                const isDuplicate = userCompetencies.some(
                    (competence) => competence.competence_name.toLowerCase() === selectedCompetence.toLowerCase()
                );

                if (isDuplicate) {
                    setError(strings.competence_exists); // Set error if competence already exists
                    return;
                }

                setUserCompetencies([...userCompetencies, {
                    competence_name: selectedCompetence,
                    years_of_experience: 0,  // Store as number
                    years_of_experienceStr: "0"  // Store as string for input
                }]);
                setSelectedCompetence("");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 mb-2">
            {strings.add_competence}
        </button>
            {/* Display Error Message with Space */}
            {error && (
            <div className="text-red-500 text-sm mt-2 px-4 py-2 bg-red-100 rounded-lg border border-red-500">
                <p>{error}</p>
                </div>
            )}

        {/* List of Selected Competencies */}
        <div className="space-y-4">
            {
            userCompetencies.map((competence, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                    <span className="text-gray-700 text-lg">{competenceLocalization[competence.competence_name][model.language] || competence.competence_name}</span>
                    <input
                        type="number"
                        step="0.1" // Allow increments/decrements of 0.1 (one decimal place)
                        min="0"
                        value={competence.years_of_experience ?? ""}
                        onChange={(e) => {
                            const updatedCompetencies = [...userCompetencies];
                            // Store raw string value
                            updatedCompetencies[index].years_of_experienceStr = e.target.value;
                            // Parse float for validation
                            updatedCompetencies[index].years_of_experience = parseFloat(e.target.value) || 0;

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
                        {strings.remove}
                    </button>
                </div>
            ))}
        </div>


        {/* Error Message for Invalid Years of Experience */}
        {userCompetencies.some(comp => comp.yearsOfExperience === 0) && (
            <p className="text-red-500 mt-4">{strings.competence_experience_empty}</p>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
            <button
                onClick={handleBack}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-300">
                {strings.back}
            </button>
            <button
                onClick={() => {
                    // Check if any competency has 0 years of experience
                    if (userCompetencies.some(comp => comp.yearsOfExperience === 0)) {
                        // alert("Please provide the years of experience for all competencies or remove them.");
                        setError(strings.competence_experience_empty);
                    } else {
                        handleNext();
                    }
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                {strings.next}
            </button>
        </div>
    </div>
)}
            {/* Availability Stage */}
            {stage === "availability" && (
    <div className="p-6 bg-white rounded-xl shadow-sm w-2/3 mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">{strings.set_availability}</h2>

        {/* Input for New Availability */}
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{strings.from_date}</label>
            <input
                type="date"
                value={newAvailability.from_date || ""}
                onChange={(e) => setNewAvailability({ ...newAvailability, from_date: e.target.value })}
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
        </div>
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{strings.to_date}</label>
            <input
                type="date"
                value={newAvailability.to_date || ""}
                onChange={(e) => setNewAvailability({ ...newAvailability, to_date: e.target.value })}
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
        </div>

        {/* Add Availability Button */}
        <button
            onClick={() => {
                if (!newAvailability.from_date || !newAvailability.to_date) {
                    setError("Please fill in both 'From Date' and 'To Date'.");
                    return;
                }

                if (new Date(newAvailability.from_date) > new Date(newAvailability.to_date)) {
                    setError("Error: 'From Date' cannot be later than 'To Date'.");
                    return;
                }

                if (isOverlapping(newAvailability.from_date, newAvailability.to_date)) {
                    setError("Error: This availability period overlaps with an existing one.");
                    return;
                }

                setAvailabilities([...availabilities, newAvailability]); // Add new availability to the list
                setNewAvailability({ from_date: "", to_date: "" }); // Reset input fields
                setError(null); // Clear any previous error messages
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 mb-2">
            {strings.add_availability}
        </button>
        {/* Display Error Message with Space */}
        {error && (
            <div className="text-red-500 text-sm mt-2 px-4 py-2 bg-red-100 rounded-lg border border-red-500">
                <p>{error}</p>
                </div>
            )}

        {/* List of Selected Availabilities */}
        <div className="space-y-4">
            {availabilities.map((availability, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                    <span className="text-gray-700">{availability.from_date} - {availability.to_date}</span>
                    <button
                        onClick={() => {
                            const updatedAvailabilities = availabilities.filter((_, i) => i !== index);
                            setAvailabilities(updatedAvailabilities);
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300">
                        {strings.remove}
                    </button>
                </div>
            ))}
        </div>

        {/* Error Message */}
        {/*newAvailability.from_date && newAvailability.to_date &&
            new Date(newAvailability.from_date) > new Date(newAvailability.to_date) && (
                <p className="text-red-500 mb-4">{strings.availability_error}</p>
            )*/}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
            <button
                onClick={handleBack}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-300">
                {strings.back}
            </button>
            
            <button
                onClick={() => {
                    if (availabilities.length === 0) {
                        // alert("Please add at least one availability period.");
                        setError("Please add at least one availability period.");
                    } else {
                        handleNext();
                    }
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                {strings.next}
            </button>
        </div>
    </div>
)}
            {/* Summary Stage */}
            {stage === "summary" && (
                <div className="p-6 bg-white rounded-xl shadow-sm w-2/3 mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">{strings.application_summary}</h2>

                    {/* User Profile Summary */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">{strings.user_profile}</h3>
                        <div className="space-y-2">
                            <p className="text-gray-700"><strong>{strings.first_name}</strong> {model?.name}</p>
                            <p className="text-gray-700"><strong>{strings.last_name}</strong> {model?.surname}</p>
                            <p className="text-gray-700"><strong>{strings.email}</strong> {model?.email}</p>
                            <p className="text-gray-700"><strong>{strings.username}</strong> {model?.username}</p>
                        </div>
                    </div>

                    {/* Competence Summary */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">{strings.competence}</h3>
                        {userCompetencies.length > 0 ? (
                            userCompetencies.map((competence, index) => (
                                <div key={index} className="p-3 bg-gray-100 rounded-lg mb-2">
                                    <p className="text-gray-700">{competenceLocalization[competence.competence_name][model.language] || competence.competence_name}: {competence.years_of_experience} {strings.years}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">{strings.no_competencies}</p>
                        )}
                    </div>

                    {/* Availability Summary */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">{strings.availability}</h3>
                        {availabilities.length > 0 ? (
                            availabilities.map((availability, index) => (
                                <div key={index} className="p-3 bg-gray-100 rounded-lg mb-2">
                                    <p className="text-gray-700">{availability.from_date} to {availability.to_date}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">{strings.no_availability}</p>
                        )}
                    </div>

                    <div>
                         {/* Display Error Message with Space */}
                            {error && (
                            <div className="text-red-500 text-sm mt-2 px-4 py-2 bg-red-100 rounded-lg border border-red-500">
                                <p>{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <button
                            onClick={handleBack}
                            className="px-6 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-300">
                            {strings.back}
                        </button>
                        <button
                            onClick={cancleUserProfile}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                            {strings.cancel}
                        </button>

                        <button
                            onClick={updateUserProfile}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                            {strings.finish}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicantView;
