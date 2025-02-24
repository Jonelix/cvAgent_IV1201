// Controller.js
const AgentDAO = require('./AgentDAO');
const Logger = require('./Logger');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class Controller {
    constructor() {
        this.agentDAO = new AgentDAO();
        this.logger = new Logger();
    }

    async login(username, password) {
        const user = await this.agentDAO.findUserWithUsername(username);
        if (user) {
            // Compare the provided password with the stored hashed password
            const isMatch = await bcrypt.compare(password, user.dataValues.password);
            if (isMatch) {
                this.logger.log("User logged in: " + JSON.stringify(user.username));
                return user.dataValues;
            }
        }
        return null;
    }

    async register(firstName, lastName, personNumber, username, email, password, confirmPassword, role_id) {
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }
        
        // Hash the password before sending it to the DAO
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await this.agentDAO.registerUser(firstName, lastName, personNumber, username, email, hashedPassword, role_id);
    
        if (user) {
            const { password, ...userData } = user.dataValues;
            console.log(userData);
            this.logger.log("User created: " + JSON.stringify(userData.username));
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
        this.logger.log(`Recruiter ${rec_id} is handling the status of applicant ${app_id}.`);
        return applicant;
    }

    async confirmStatusUpdate (rec_id, app_id, status) {
        const applicant = await this.agentDAO.confirmStatusUpdate(rec_id, app_id, status);
        this.logger.log(`Recruiter ${rec_id} is updated the status of applicant ${app_id} to ${status}.`);
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

    async createApplication(person_id, competencies, availabilities) {
        const application = await this.agentDAO.createApplication(
            person_id, 
            competencies, 
            availabilities
        );
        this.logger.log(`Application created for person ${person_id}.`);
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