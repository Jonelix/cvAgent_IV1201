const jwt = require('jsonwebtoken');


class Authentication{

async createCookie(userId){
  console.log("cookie user id: " + userId)
  const cookie = jwt.sign(
    userId,
    process.env.JWT_KEY
  );
  return cookie;
}


}

module.exports = Authentication
