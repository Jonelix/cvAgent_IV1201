
import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; 


const ApplicantView = ({ model }) => {
    const navigate = useNavigate();
    const [competencies, setCompetencies] = useState([]);
    const [person, setPerson] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleCreateNewApplication = () => {
        // Logic to reset application state
        navigate("/applicant", { state: { newApplication: true } });
    };

    const fetchCompetencies = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/competencies", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await response.json();
            if (!response.ok) {
                // Return the detailed error message from the server response
                throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            }
            console.log("Response:", data);
            setCompetencies(data);
            return data;
        }catch(error){
            console.error("Error:", error.message);
            return { error: error.message };
        }
    };

    
    const fetchPerson = async (e) => {
        try {
            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/fetchPerson", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ firstName, lastName }),
            });
            const data = await response.json();
            if (!response.ok) {
                // Return the detailed error message from the server response
                throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            }

            console.log("Response:", data);
            setPerson(data);
            return data; // Return user data if successfuls
        }catch (error) {
            console.error("Error:", error.message);
            return { error: error.message }; // Return error message instead of throwing
        }
    };

    const registerApplication = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://cvagent-b8c3fb279d06.herokuapp.com/api/application", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // body: JSON.stringify({ }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            alert("User registered successfully");
            console.log("Response:", data);
            goToLogin();
            return data;
        } catch (error) {
            console.error("Error:", error.message);
            return { error: error.message };
        }
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
                            onClick={fetchCompetencies} 
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                            Fetch Data
                        </button>
                        {/* Display fetched competence data */}
                        {competencies.length > 0 ? (
                            <div className="mt-4">
                                <ul>
                                    {competencies.map((competence, index) => (
                                        <li key={index} className="mb-2">
                                            <p>{competence.name}</p>
                                        </li>
                                    ))}
                                </ul>
                                
                            </div>
                        ) : (
                            <p className="text-gray-600">(Person details will be displayed here)</p>
                        )}
                    </div>
                    <p className="text-gray-600">(Competence details will be displayed here)</p>


                    <div>
                        <h2 className="text-xl font-semibold mt-4">Person</h2>

                        <input 
                            type="text" 
                            placeholder="First Name" 
                            style={{ border: "1px solid black", padding: "5px", borderRadius: "4px" }} 
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <input 
                            type="text" 
                            placeholder="Last Name" 
                            style={{ border: "1px solid black", padding: "5px", borderRadius: "4px" }} 
                            onChange={(e) => setLastName(e.target.value)}
                        />

                        <button 
                            onClick={fetchPerson} 
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                            Fetch Data
                        </button>


                        {/* Display User Data */}
                        <div className="mb-6">
                            <h2 className="text-xl font-bold">User Profile</h2>
                            <div className="space-y-2">
                            <p><strong>Name:</strong> {model?.name}</p>
                            <p><strong>Surname:</strong> {model?.surname}</p>
                            <p><strong>Email:</strong> {model?.email}</p>
                            <p><strong>Username:</strong> {model?.username}</p>
                            {console.log(model)}

                        </div>
                        </div>

                        {/* Display fetched person data */}
                        {person.length > 0 ? (
                            <div className="mt-4">
                                <ul>
                                    {person.map((person, index) => (
                                        <li key={index} className="mb-2">
                                            <p>{person.name}</p>
                                        </li>
                                    ))}
                                </ul>
                                
                            </div>
                        ) : (
                            <p className="text-gray-600">(Person details will be displayed here)</p>
                        )}
                    </div>
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
