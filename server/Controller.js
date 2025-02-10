// Controller.js
const AgentDAO = require('./AgentDAO');

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

    async register(firstName, lastName, personNumber, username, email, password, confirmPassword, role_id) {
        console.log("Creating user in contr...")
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }
        const user = await this.agentDAO.registerUser(firstName, lastName, personNumber, username, email, password, role_id);
    
        if (user) {
            const { password, ...userData } = user.dataValues;
            console.log(userData)
            return userData;
        }
        return null;
    }
}

module.exports = Controller;