const jwt = require('jsonwebtoken');


class Authentication{

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
