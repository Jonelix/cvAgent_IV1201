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

    async competencies() {
        const competencies = await this.agentDAO.getCompetencies();
        return competencies;
    }

    async applicantProfiles() {
        const applicant = await this.agentDAO.getApplicantProfiles();
        return applicant;
    }

    async getApplicantProfile(applicant_id) {
        const applicant = await this.agentDAO.getApplicantProfile(applicant_id);
        return applicant;
    }

    async handleApplicantStatus(rec_id, app_id, timestamp) {
        const applicant = await this.agentDAO.handleApplicantStatus(rec_id, app_id);
        return applicant;
    }

    async confirmStatusUpdate (rec_id, app_id, status) {
        const applicant = await this.agentDAO.confirmStatusUpdate(rec_id, app_id, status);
        return applicant;
    }

    async application(){
        const application = await this.agentDAO.createApplication();
        return application;
    }

    async fetchPerson(firstName, lastName){
        const person = await this.agentDAO.fetchPerson(firstName, lastName);
        return person;
    }

    async userCompetencies(person_id){
        const userCompetencies = await this.agentDAO.getUserCompetencies(person_id);
        return userCompetencies;
    }

    async userAvailability(person_id){
        const userAvailability = await this.agentDAO.getUserAvailability(person_id);
        return userAvailability;
    }

    async createApplication(person_id, userCom, userYear, from_date, to_date){
        const application = await this.agentDAO.createApplication(person_id, userCom, userYear, from_date, to_date);
        return application;
    }

    async deleteAvailability(person_id){
        const application = await this.agentDAO.deleteAvailability(person_id);
        return application;
    }

    async deleteCompetence(person_id){
        const application = await this.agentDAO.deleteCompetence(person_id);
        return application;
    }
}

module.exports = Controller;