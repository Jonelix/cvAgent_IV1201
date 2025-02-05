import React, { useState } from 'react';


const AuthentificationView = () => {
    function goToRegister() {
        // Redirect to the register page
        window.location.href = "#/reg";
    }

    const [data, setData] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const fetchData = async (e) => {
        e.preventDefault(); // Prevent form submission from reloading the page
        try {
          const response = await fetch('http://localhost:5005/api/data');
          const result = await response.json();
          setData(result); // Set the data to be displayed
          console.log(result); // Log the result for debugging
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
    

    return (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 p-8">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                {/* Title */}
                <h2 className="text-2xl font-bold mb-6 text-left text-gray-700">Login</h2>

                {/* Login Form */}
                <form className="flex flex-col gap-6">
                    {/* Username or Email */}
                    <div>
                        <label className="block text-gray-600 text-sm font-semibold mb-2">Username or Email</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-600 text-sm font-semibold mb-2">Password</label>
                        <input 
                            type="password" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>

                    {/* Login Button */}
                    <div>
                        <button className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all">
                            Login
                        </button>
                    </div>

                    <div>                         
                        <button type="button" onClick={fetchData} className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all">
                                Connect to DB
                        </button>

                        <div>
                    <h3>Data:</h3>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                    </div>
                    </div>


                    {/* Register Link */}
                    <div className="text-center">
                        <p onClick={goToRegister} className="text-blue-500 hover:underline">
                            Register an account
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthentificationView;