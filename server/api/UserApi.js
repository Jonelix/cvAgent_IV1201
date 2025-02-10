'use strict';

//const {check, validationResult} = require('express-validator');
const RequestHandler = require('./RequestHandler');
const Authorization = require('./auth/Authorization');

/**
 * Defines the REST API with endpoints related to users.
 */
class UserApi extends RequestHandler {
  /**
   * Constructs a new instance.
   */
  constructor() {
    super();
  }

  /**
   * @return {string} The URL paths handled by this request handler.
   */
  get path() {
    return UserApi.USER_API_PATH;
  }

  /**
   * @return {string} The URL paths handled by this request handler.
   */
  static get USER_API_PATH() {
    return '/user';
  }

  /**
   * Registers the request handling functions.
   */
  async registerHandler() {
    try {
        await this.retrieveController();

        this.router.post('/login', async (req, res, next) => {
            try {
                const loggedInUser = await this.contr.login(req.body.username, req.body.password);
                if (loggedInUser === null) {
                    this.sendHttpResponse(res, 401, 'Login failed');
                    return;
                } else {
                    Authorization.sendAuthCookie(loggedInUser, res);
                    this.sendHttpResponse(res, 204, loggedInUser);
                    return;
                }
            } catch (err) {
                next(err);
            }
        });

    } catch (err) {
        console.error("Error in registerHandler:", err);
    }
}
}

module.exports = UserApi;