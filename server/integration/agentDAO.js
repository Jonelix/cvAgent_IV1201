'use strict';

const cls = require('cls-hooked');
const Sequelize = require('sequelize');
const WError = require('verror').WError;
const Validators = require('../util/Validators');
const UserDTO = require('../model/UserDTO');
const User = require('../model/User');
//const ApplicationDTO = require('../model/ApplicationDTO');
//const Application = require('../model/Application');

/**
 * This class is responsible for all calls to the database. There shall not
 * be any database-related code outside this class.
 */
class AgentDAO {
  /**
   * Creates a new instance and connects to the database.
   */
  constructor() {
    const namespace = cls.createNamespace('cvagent-db');
    Sequelize.useCLS(namespace);
    this.database = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {host: process.env.DB_HOST, dialect: 'postgres'},
    );
    //Application.createModel(this.database);
    User.createModel(this.database);
  }

  /**
   * @return {Object} The sequelize transaction manager, which is actually the
   *                  database object. This method is called
   *                  <code>getTransactionMgr</code> since the database is only
   *                  supposed to be used for transaction handling in higher
   *                  layers.
   */
  getTransactionMgr() {
    return this.database;
  }

  /**
   * Creates non-existing tables, existing tables are not touched.
   *
   * @throws Throws an exception if the database could not be created.
   */
  async createTables() {
    try {
      await this.database.authenticate();
      await this.database.sync({force: false});
    } catch (err) {
      throw new WError(
          {
            cause: err,
            info: {AgentDAO: 'Failed to call authenticate and sync.'},
          },
          'Could not connect to database.',
      );
    }
  }

  /**
   * Searches for a user with the specified username.
   *
   * @param {string} email The email of the searched user.
   * @return {array} An array containing the user with the
   *                 specified email. The array is empty if no matching
   *                 users were found.
   * @throws Throws an exception if failed to search for the specified user.
   */
  async findUserByEmail(email) {
    try {
      //Validators.isNonZeroLengthString(username, 'username');
      //Validators.isAlnumString(username, 'username');
      const user = await User.findAll({
        where: {email: email},
      });
      return user.map((userModel) => this.createUserDto(userModel));
    } catch (err) {
      throw new WError(
          {
            cause: err,
            info: {
              AgentDAO: 'Failed to search for user.',
              email: email,
            },
          },
          `Could not search for user ${email}.`,
      );
    }
  }

  async updateUser(user) {
    try {
      Validators.isInstanceOf(user, UserDTO, 'user', 'UserDTO');
      await User.update(user, {
        where: {id: user.id},
      });
    } catch (err) {
      throw new WError(
          {
            cause: err,
            info: {
              AgentDAO: 'Failed to update user.',
              username: user.username,
            },
          },
          `Could not update user ${user.username}.`,
      );
    }
  }

  
  // eslint-disable-next-line require-jsdoc
  createUserDto(userModel) {
    return new UserDTO(
        userModel.firstName,
        userModel.lastName,
        userModel.personNumber,
        userModel.username,
        userModel.email,
        userModel.password
    );
  }

  createApplicationDto(applicationModel) {
    return new ApplicationDTO(
        //Fill in attributes
    );
  }
}

module.exports = AgentDAO;