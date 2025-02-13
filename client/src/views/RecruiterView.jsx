import { useState } from "react";
import applicantsData from './applicants.json';

const statusColors = {
    0: "bg-yellow-400", // Unhandled
    1: "bg-green-400", // Accepted
    2: "bg-red-400", // Rejected
};

const statusText = {
    0: "Unhandled",
    1: "Accepted",
    2: "Rejected",
};

const RecruiterView = ({ applicants }) => {
    applicants = applicantsData || [];
    const [expanded, setExpanded] = useState(null);
    const [editingStatus, setEditingStatus] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    return (
        <div className="w-full h-full p-4 overflow-auto">
            <h1 className="text-2xl font-bold mb-4">Applicants</h1>
            <div className="space-y-2">
                {applicants.map((applicant) => (
                    <div
                        key={applicant.person_id}
                        className={`shadow-md rounded-lg p-4 transition-all cursor-pointer ${expanded === applicant.person_id ? "h-auto" : "h-16"}`}
                        onClick={() => setExpanded(expanded === applicant.person_id ? null : applicant.person_id)}
                    >
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold">{`${applicant.person_name} ${applicant.surname}`}</p>
                            <div className="flex items-center">
                                {expanded === applicant.person_id && !editingStatus && (
                                    <button
                                        className="mr-2 border border-black px-2 py-1 rounded-md shadow"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingStatus(applicant.person_id);
                                        }}
                                    >
                                        Change
                                    </button>
                                )}
                                {editingStatus === applicant.person_id ? (
                                    <>
                                        <select
                                            className="mr-2 p-1 border rounded shadow-md"
                                            value={selectedStatus ?? applicant.status}
                                            onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
                                        >
                                            {Object.entries(statusText).map(([key, text]) => (
                                                <option key={key} value={key}>
                                                    {text}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            className="bg-slate-600 text-white px-2 py-1 rounded shadow"
                                            onClick={() => {
                                                setEditingStatus(null);
                                                setSelectedStatus(null);
                                                // Call handleStatusChange(selectedStatus, applicant.person_id) here
                                            }}
                                        >
                                            Confirm
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <p className="mr-2 font-bold">{statusText[applicant.status]}</p>
                                        <div className={`w-5 h-5 rounded-full ${statusColors[applicant.status]}`}></div>
                                    </>
                                )}
                            </div>
                        </div>

                        {expanded === applicant.person_id && (
                            <div className="mt-4 flex gap-4">
                                {/* Competencies */}
                                <div className="flex-1 shadow-md rounded-lg p-2">
                                    <h2 className="font-semibold mb-2">Competencies</h2>
                                    <ul className="list-disc pl-4">
                                        {applicant.competencies.map((comp, index) => (
                                            <li key={index}>{`${comp.competence_name} (${comp.years_of_experience} years)`}</li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Availability */}
                                <div className="flex-1 shadow-md rounded-lg p-2">
                                    <h2 className="font-semibold mb-2">Availability</h2>
                                    <ul className="list-disc pl-4">
                                        {applicant.availability.map((period, index) => (
                                            <li key={index}>{`${period.startdate} - ${period.enddate}`}</li>
                                        ))}
                                    </ul>
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
