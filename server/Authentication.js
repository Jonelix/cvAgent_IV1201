const jwt = require('jsonwebtoken');


class Authentication{

async createCookie(user){
  console.log("cookie user id: " + JSON.stringify(user))
  const { username, password } = user;
  const cookie = jwt.sign(
    { username, password },
    process.env.JWT_KEY,
     {expiresIn: '30m'}
  );

  return cookie;
}

async authenticateCookie(cookie){
  console.log("Token received:", cookie);
  const authCookieValue = cookie.split('authCookie=')[1];
    const decoded = jwt.verify(authCookieValue, process.env.JWT_KEY);
    console.log("Token data:", decoded);
    const { password, username } = decoded;
    return { username, password }

  //console.log(JSON.stringify(decoded))
}

}

module.exports = Authentication
