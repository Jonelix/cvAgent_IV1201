/**
 * Authentication - Handles user authentication using JWT tokens.
 * This class provides methods to create and verify authentication cookies.
 */
const jwt = require('jsonwebtoken');

class Authentication{
 /**
 * Creates a JWT-based authentication cookie for a user.
 * @param {Object} user - The user object containing username and password.
 * @param {string} user.username - The username of the user.
 * @param {string} user.password - The password of the user.
 * @returns {Promise<string>} - A signed JWT token representing the authentication cookie.
 */  
async createCookie(user){
  const { username, password } = user;
  console.log("in cookie \n username: " + username + " password: " + password);
  const cookie = jwt.sign(
    { username, password },
    process.env.JWT_KEY,
     {expiresIn: '30m'}
  );

  return cookie;
}
/**
* Authenticates a given JWT authentication cookie.
* Extracts the cookie value, verifies it, and decodes the user credentials.
* @param {string} cookie - The JWT authentication cookie.
* @returns {Promise<Object>} - An object containing the decoded username and password.
* @throws {Error} - Throws an error if the cookie is invalid or expired.
*/
async authenticateCookie(cookie){
  const authCookieValue = cookie.split('authCookie=')[1];
    const decoded = jwt.verify(authCookieValue, process.env.JWT_KEY);
  console.log("decoded cookie:");
  console.log(decoded);
    const { password, username } = decoded;
    return { username, password }

  //console.log(JSON.stringify(decoded))
}


}

module.exports = Authentication
