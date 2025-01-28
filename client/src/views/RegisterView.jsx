import RegisterView from "../views/RegisterView.jsx";
import { observer } from "mobx-react-lite";

const RegisterPresenter = observer(() => {

    return (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 p-8">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
                {/* Title */}
                <h2 className="text-2xl font-bold mb-6 text-left text-gray-700">Register</h2>

                {/* Registration Form */}
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Column 1 */}
                    <div className="flex flex-col gap-6">
                        {/* First Name */}
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-2">First Name</label>
                            <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-2">Last Name</label>
                            <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        {/* ID Number */}
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-2">ID Number</label>
                            <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-2">Username</label>
                            <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col gap-6">
                        {/* Email */}
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-2">Email</label>
                            <input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-2">Password</label>
                            <input type="password" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-gray-600 text-sm font-semibold mb-2">Confirm Password</label>
                            <input type="password" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        {/* Register Button */}
                        <div>
                            <button className="w-full mt-7 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all">
                                Register
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
});

export default RegisterPresenter;