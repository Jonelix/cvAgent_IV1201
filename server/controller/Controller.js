'use strict';

const Validators = require('../util/Validators');
const AgentDAO = require('../integration/agentDAO');
const UserDTO = require('../model/UserDTO');

/**
 * The application's controller. No other class shall call the model or
 * integration layer.
 */
class Controller {
  /**
   * Creates a new instance.
   */
  constructor() {
    this.agentDAO = new AgentDAO();
    this.transactionMgr = this.agentDAO.getTransactionMgr();
  }

  /**
   * Instantiates a new Controller object.
   *
   * @return {Controller} The newly created controller.
   */
  static async createController() {
    const contr = new Controller();
    await contr.agentDAO.createTables();
    return contr;
  }

  /**
   * Log in a user.
   *
   * @param {string} username: The username of the user logging in.
   * @param {string} password: The password of the user logging in.
   * @return {User} The logged in user if login succeeded, or null if login failed.
   * @throws Throws an exception if unable to attempt to login the specified user.
   */
  async login(email, password) {
    return this.transactionMgr.transaction(async (t1) => {
      //Validators.isNonZeroLengthString(username, 'username');
      //Validators.isAlnumString(username, 'username');
      const user = await this.agentDAO.findUserByEmail(email);
      if (user.length === 0) {
        return null;
      }
      if (user[0].password !== password) {
        return null;
      } 
      const loggedInUser = user[0];
      //await this.setUsersStatusToLoggedIn(users[0]);
      return loggedInUser;
    });
  }

  /**
   * Checks if the specified user is logged in.
   *
   * @param {string} username: The username of the user logging in.
   * @return {UserDTO} A userDTO describing the logged in user if the user is
   *                   logged in. Null if the user is not logged in.
   * @throws Throws an exception if failed to verify whether the specified user
   *         is logged in.
   */
  async isLoggedIn(username) {
    return this.transactionMgr.transaction(async (t1) => {
      //Validators.isNonZeroLengthString(username, 'username');
      //Validators.isAlnumString(username, 'username');
      const users = await this.agentDAO.findUserByUsername(username);
      if (users.length === 0) {
        return null;
      }
      const loggedInUser = users[0];
      return loggedInUser;
      /*
      const loginExpires = new Date(loggedInUser.loggedInUntil);
      if (!this.isValidDate(loginExpires)) {
        return null;
      }
      const now = new Date();
      if (loginExpires < now) {
        return null;
      }
      return loggedInUser;
      */
    });
  }

  /*
   * only 'private' helper methods below
   */

  // eslint-disable-next-line require-jsdoc
  async setUsersStatusToLoggedIn(user) {
    const hoursToStayLoggedIn = 24;
    const now = new Date();
    user.loggedInUntil = now.setHours(now.getHours() + hoursToStayLoggedIn);
    await this.agentDAO.updateUser(user);
  }

  // eslint-disable-next-line require-jsdoc
  isValidDate(date) {
    return !isNaN(date.getTime());
  }
}
module.exports = Controller;