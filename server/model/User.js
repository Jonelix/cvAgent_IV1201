'use strict';

const Sequelize = require('sequelize');

/**
 * A login user of the agent application.
 */
class User extends Sequelize.Model {
  /**
   * The name of the Credential model.
   */
  static get USER_MODEL_NAME() {
    return 'user';
  }

  /**
   * Defines the User entity.
   *
   * @param {Sequelize} sequelize The sequelize object.
   * @return {Model} A sequelize model describing the User entity.
   */
  static createModel(sequelize) {
    User.init(
        {
            firstName: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            lastName: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            personNumber: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            username: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            }
        },
        {sequelize, modelName: User.USER_MODEL_NAME, paranoid: true}
    );
    return User;
  }
}

module.exports = User;