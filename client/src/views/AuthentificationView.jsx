import React, { useState } from 'react';


const AuthentificationView = () => {
    function goToRegister() {
        // Redirect to the register page
        window.location.href = "#/reg";
    }


    const [data, setData] = useState([]);
    const [user, setUser] = useState([]); 
    const [userPassword, setUserPassword] = useState([]); 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const fetchData = async (e) => {
        e.preventDefault(); // Prevent form submission from reloading the page
        try {
          const response = await fetch('http://localhost:5005/api/applicant');
          const result = await response.json();
          setData(result); // Set the data to be displayed
          console.log(result); // Log the result for debugging
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      const fetchUser = async (e) => {
        e.preventDefault(); // Prevent form submission from reloading the page
        try {
          const response = await fetch('http://localhost:5005/api/recruiter');
          const result = await response.json();
          setUser(result); // Set the data to be displayed
          console.log(result); // Log the result for debugging
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      const fetchPassword = async (e) => {
        e.preventDefault(); // Prevent form submission from reloading the page
        if (!username){alert("Please enter a username");}
        try {
            const response = await fetch(`http://localhost:5005/api/password/${username}`);
            if(!response.ok){
                throw new Error("User not found or other error.");   
            }
            const result = await response.json();
            setUserPassword(result.password || "No password found");
            console.log(result); // Log the result for debugging
        } catch (error) {
          console.error('Error fetching data:', error);
          setUserPassword("User not found"); 

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


                    {/* Fetch User Button */}
                   <div>                         
                        <button type="button" onClick={fetchPassword} className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all">
                            Get password with username
                        </button>

                        <div>
                            <h3>Password:</h3>
                            <pre>{userPassword ? userPassword : "No password found"}</pre>
                            </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-600 text-sm font-semibold mb-2">Password</label>
                        <input 
                            type="password" 
                            value={password}  // Bind the password state here
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>
                    {/* Login Button */}
                    <div>
                        <button className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all">
                            Login
                        </button>
                    </div>


 
                    {/* Fetch User Button */}
                   <div>                         
                        <button type="button" onClick={fetchUser} className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all">
                            Show all recruiter
                        </button>

                        <div>
                            <h3>Recruiter:</h3>
                            <pre>{JSON.stringify(user, null, 2)}</pre> {/* Display fetched user data here */}
                        </div>
                    </div>

                    <div>                         
                        <button type="button" onClick={fetchData} className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all">
                                Show first 20 applikant
                        </button>

                        <div>
                            <h3>Applikant:</h3>
                            <pre>{JSON.stringify(data, null, 2)}</pre> {/* Display fetched user data here */}
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