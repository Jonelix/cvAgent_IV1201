'use strict';

const Validators = require('../util/Validators');

/**
 * A user of the chat application.
 */
class UserDTO {
  /**
   * Creates a new instance.
   * 
   * @param {string} username The username of signed in user.
   * 
   * @param {string} firstName The first name of the signed in user.
   * 
   * @param {string} lastName The last name of the signed in user.
   * 
   * @param {string} personNumber The person number of the signed in user.
   * 
   * @param {string} email The email of the signed in user.
   * 
   * @param {string} password The password of the signed in user
   */
  constructor(firstName, lastName, personNumber, username, email, password) {
    //TODO: PASS EVERYTHING THOURGH VALIDATORS
    this.firstName = firstName;
    this.lastName = lastName;
    this.personNumber = personNumber;
    this.username = username;
    this.email = email;
    this.password = password;
  }
}

module.exports = UserDTO;