import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

const ProfileView = ({ model, strings}) => {


    function backToLogin() {
        window.location.href = "#/auth";
    }
  console.log("this is the model:");
  console.log(model);
    return (
        <div className="w-full flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                {/* Dashboard Button */}
                <div className="flex justify-between items-center mb-6">
                    <Link
                        to="/dashboard" // Path to the Dashboard
                        className="text-blue-600 font-semibold hover:text-blue-800"
                    >
                        {strings.dashboard}
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-700">{strings.user_profile}</h2>
                </div>

                {/* Profile Information */}
                <div className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600 font-semibold">{strings.full_name}</span>
                        <span className="text-gray-800">{model.name} {model.surname}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600 font-semibold">{strings.username}</span>
                        <span className="text-gray-800">{model.username}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600 font-semibold">{strings.email}</span>
                        <span className="text-gray-800">{model.email}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600 font-semibold">{strings.user_id}</span>
                        <span className="text-gray-800">{model.person_id}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600 font-semibold">{strings.id_number}</span>
                        <span className="text-gray-800">{model.pnr}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600 font-semibold">{strings.role_id}</span>
                        <span className="text-gray-800">{model.role_id}</span>
                    </div>
                </div>

                <div>
                        <button onClick={backToLogin} className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all">
                            {strings.back_to_login}
                        </button>
                </div>

            </div>
        </div>
    );
};

export default ProfileView;

/*import React from "react";

const ProfileView = ({ model }) => {
    return (
        <div className="w-full flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">User Profile</h2>

                <div className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600 font-semibold">Full Name:</span>
                        <span className="text-gray-800">{model.name} {model.surname}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600 font-semibold">Username:</span>
                        <span className="text-gray-800">{model.username}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600 font-semibold">Email:</span>
                        <span className="text-gray-800">{model.email}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600 font-semibold">Person ID:</span>
                        <span className="text-gray-800">{model.person_id}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600 font-semibold">PNR:</span>
                        <span className="text-gray-800">{model.pnr}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600 font-semibold">Role ID:</span>
                        <span className="text-gray-800">{model.role_id}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
*/
