// Controller.js
const AgentDAO = require('./AgentDAO');
const Auth = require('./Authentication')
const Logger = require('./Logger');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class Controller {
    constructor() {
        this.agentDAO = new AgentDAO();
        this.logger = new Logger();
        this.Auth = new Auth();
    }

    async login(username, password) {
        const user = await this.agentDAO.findUserWithUsername(username);
        if (user) {
            // Compare the provided password with the stored hashed password
            const isMatch = await bcrypt.compare(password, user.dataValues.password);
            if (isMatch) {
                this.logger.log("User logged in: " + JSON.stringify(user.username));
                console.log("data values are:")
                console.log(user.dataValues);
                //delete user.dataValues.password;
                return user.dataValues;
            }
        }
        return null;
    }

    /*
   param: cookie


    */
    async authenticateCookie(cookie){
        const { username, password } = await this.Auth.authenticateCookie(cookie)
        const user = await this.agentDAO.findUserWithUsername(username);
      if (user) {
        if(password == user?.dataValues.password){
          this.logger.log("User logged in: " + JSON.stringify(user.username));
          //delete user.dataValues.password;
          return user.dataValues;
        }
    }
        return null;
 
     /*   console.log("Calling authenticateCookie:");
      if(this.agentDAO.checkCookie(cookie)){
        const { username, password } = await this.Auth.authenticateCookie(cookie)
        const user = await this.agentDAO.findUserWithUsername(username);
      if (user) {
        if(password == user?.dataValues.password){
          this.logger.log("User logged in: " + JSON.stringify(user.username));
          //delete user.dataValues.password;
          return user.dataValues;
        }
      }else{
        console.log("Cookie not found or error when loading cookie");
        return null;
      }
      }  */  
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
            this.logger.log("User created: " + JSON.stringify(userData.username));
            //delete user.dataValues.password;
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

    async makeCookie(user){
        const cookie = await this.Auth.createCookie(user);
        const resp = await this.agentDAO.insertCookie(cookie);
        
        if(resp == -1){
            return -1;
        }
        return cookie;

    }

    async checkUser(cookie){
      const user = await this.authenticateCookie(cookie);
      if(user != null){ //CECK ERROR
        return user;
      }
      return -1;
      }
    async requestPasscode(email) {
        const passcode = Math.random().toString(36).slice(2, 10).toUpperCase();
        const migratingUser = await this.agentDAO.requestPasscode(email, passcode);
    
        // Ensure migratingUser exists before destructuring
        if (!migratingUser) return null;
    
        // Return only the required fields
        return {
            email: migratingUser.email,
            recovery_token: migratingUser.recovery_token,
        };
    }

    async confirmPasscode(email, passcode){
        const migratingUser = await this.agentDAO.confirmPasscode(email, passcode);
        // Ensure migratingUser exists before destructuring
        if (!migratingUser) return null;
    
        // Return only the required fields
        return {
            email: migratingUser.email,
        };
    }

    async updateMigratingApplicant(email, passcode, username, password, confirmPassword){
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const migratingUser = await this.agentDAO.updateMigratingApplicant(email, passcode, username, hashedPassword);
        this.logger.log(`User ${email} reset account details.`);
        return migratingUser;
    }

    async updateRecruiter(person_id, email, pnr){
        const recruiter = await this.agentDAO.updateRecruiter(person_id, email, pnr);
        this.logger.log(`Recruiter ${person_id} updated their details.`);
        return recruiter;
    }


}

module.exports = Controller;
