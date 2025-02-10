// Controller.js
const AgentDAO = require('./AgentDAO');
const bcrypt = require('bcrypt');

class Controller {
    constructor() {
        this.agentDAO = new AgentDAO();
    }

    async login(username, password) {
        const user = await this.agentDAO.findUserWithUsername(username);
        if (user && password ==  user.dataValues.password) {
            return user.dataValues;
        }
        return null;
    }
}

module.exports = Controller;