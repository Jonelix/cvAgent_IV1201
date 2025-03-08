/**
 * Controller - Handles business logic and user interactions.
 * 
 * This class acts as an intermediary between the AgentDAO, Authentication, and Logger classes,
 * managing user authentication, registration, applications, and various database operations.
 */
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

    /**
     * Logs in a user by validating their username and password.
     * @param {string} username - The username of the user.
     * @param {string} password - The user's password.
     * @returns {Promise<Object|null>} - User data if authentication is successful, otherwise null.
     */
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

    /**
     * Authenticates a cookie and verifies user credentials.
     * @param {string} cookie - The authentication cookie.
     * @returns {Promise<Object|null>} - The authenticated user data or null if authentication fails.
     */
    async authenticateCookie(cookie){
        const bluescook = cookie.split('authCookie=')[1];
        const respDB = await this.agentDAO.checkCookie(bluescook);
        if(respDB == -1){
            return null;
        }
        console.log("Cookie from db");
        console.log(respDB);
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

    /**
     * Registers a new user.
     * @param {string} firstName - First name of the user.
     * @param {string} lastName - Last name of the user.
     * @param {string} personNumber - Unique personal number.
     * @param {string} username - The chosen username.
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @param {string} confirmPassword - Confirmation of the password.
     * @param {number} role_id - The role ID assigned to the user.
     * @returns {Promise<Object|null>} - The created user data or null if registration fails.
     * @throws {Error} - Throws an error if passwords do not match.
     */
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

    /**
     * Retrieves all competencies.
     * @returns {Promise<Array>} - A list of competencies.
     */
    async competencies() {
        const competencies = await this.agentDAO.getCompetencies();
        return competencies;
    }

    /**
     * Retrieves all applicant profiles.
     * @returns {Promise<Array>} - A list of applicant profiles.
     */
    async applicantProfiles() {
        const applicant = await this.agentDAO.getApplicantProfiles();
        return applicant;
    }

    /**
     * Retrieves a specific applicant profile.
     * @param {number} applicant_id - The ID of the applicant.
     * @returns {Promise<Object>} - The applicant's profile data.
     */
    async getApplicantProfile(applicant_id) {
        const applicant = await this.agentDAO.getApplicantProfile(applicant_id);
        return applicant;
    }

    /**
     * Assigns an applicant's status to a recruiter.
     * @param {number} rec_id - The ID of the recruiter handling the status.
     * @param {number} app_id - The ID of the applicant.
     * @param {string} timestamp - The timestamp of the action.
     * @returns {Promise<Object>} - The updated applicant status.
     */
    async handleApplicantStatus(rec_id, app_id, timestamp) {
        const applicant = await this.agentDAO.handleApplicantStatus(rec_id, app_id);
        this.logger.log(`Recruiter ${rec_id} is handling the status of applicant ${app_id}.`);
        return applicant;
    }

    /**
     * Confirms and updates the status of an applicant.
     * @param {number} rec_id - The ID of the recruiter.
     * @param {number} app_id - The ID of the applicant.
     * @param {number} status - The new status of the application.
     * @returns {Promise<Object>} - The updated applicant status.
     */
    async confirmStatusUpdate (rec_id, app_id, status) {
        const applicant = await this.agentDAO.confirmStatusUpdate(rec_id, app_id, status);
        this.logger.log(`Recruiter ${rec_id} is updated the status of applicant ${app_id} to ${status}.`);
        return applicant;
    }

    /**
     * Creates a new job application.
     * @returns {Promise<Object>} - The created application data.
     */
    async application(){
        const application = await this.agentDAO.createApplication();
        return application;
    }

    /**
     * Fetches a person by their first and last name.
     * @param {string} firstName - The first name of the person.
     * @param {string} lastName - The last name of the person.
     * @returns {Promise<Object|null>} - The person data if found, otherwise null.
     */
    async fetchPerson(firstName, lastName){
        const person = await this.agentDAO.fetchPerson(firstName, lastName);
        return person;
    }

    /**
     * Retrieves the competencies of a user.
     * @param {number} person_id - The ID of the user.
     * @returns {Promise<Array>} - A list of user competencies.
     */
    async userCompetencies(person_id){
        const userCompetencies = await this.agentDAO.getUserCompetencies(person_id);
        return userCompetencies;
    }

    /**
     * Retrieves the availability of a user.
     * @param {number} person_id - The ID of the user.
     * @returns {Promise<Array>} - A list of user availability periods.
     */
    async userAvailability(person_id){
        const userAvailability = await this.agentDAO.getUserAvailability(person_id);
        return userAvailability;
    }

    /**
     * Creates a new application for a person.
     * @param {number} person_id - The ID of the person submitting the application.
     * @param {Array} competencies - An array of competencies.
     * @param {Array} availabilities - An array of availability periods.
     * @returns {Promise<Object>} - The created application data.
     */
    async createApplication(person_id, competencies, availabilities) {
        const application = await this.agentDAO.createApplication(
            person_id,
            competencies,
            availabilities
        );
        this.logger.log(`Application created for person ${person_id}.`);
        return application;
    }

    /**
     * Deletes a user's availability data.
     * @param {number} person_id - The ID of the user.
     * @returns {Promise<Object>} - The response from the deletion process.
     */
    async deleteAvailability(person_id){
        const application = await this.agentDAO.deleteAvailability(person_id);
        return application;
    }

    /**
     * Deletes a user's competencies.
     * @param {number} person_id - The ID of the user.
     * @returns {Promise<Object>} - The response from the deletion process.
     */
    async deleteCompetence(person_id){
        const application = await this.agentDAO.deleteCompetence(person_id);
        return application;
    }

    /**
     * Creates an authentication cookie for a user.
     * @param {Object} user - The user data for which the cookie is created.
     * @returns {Promise<string>} - The authentication cookie.
     */
    async makeCookie(user){
        const cookie = await this.Auth.createCookie(user);
        const resp = await this.agentDAO.insertCookie(cookie);
        
        if(resp == -1){
            return -1;
        }
        return cookie;

    }

    /**
     * Validates the authentication cookie and returns the authenticated user.
     * @param {string} cookie - The authentication cookie.
     * @returns {Promise<Object|null>} - The authenticated user data or null if invalid.
     */
    async checkUser(cookie){
      const user = await this.authenticateCookie(cookie);
      if(user != null){ //CECK ERROR
        return user;
      }
      return -1;
      }

    /**
     * Requests a passcode for password recovery.
     * @param {string} email - The email of the user requesting a passcode.
     * @returns {Promise<Object|null>} - An object containing the email and recovery token, or null if unsuccessful.
     */  
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

    /**
     * Confirms a passcode for password recovery.
     * @param {string} email - The email associated with the passcode.
     * @param {string} passcode - The passcode provided by the user.
     * @returns {Promise<Object|null>} - An object containing the email if successful, otherwise null.
     */
    async confirmPasscode(email, passcode){
        const migratingUser = await this.agentDAO.confirmPasscode(email, passcode);
        // Ensure migratingUser exists before destructuring
        if (!migratingUser) return null;

        // Return only the required fields
        return {
            email: migratingUser.email,
        };
    }

    /**
     * Updates a migrating applicant's account details, including username and password.
     * @param {string} email - The email of the applicant.
     * @param {string} passcode - The passcode for verification.
     * @param {string} username - The new username.
     * @param {string} password - The new password.
     * @param {string} confirmPassword - The password confirmation.
     * @returns {Promise<Object|null>} - The updated applicant data if successful, otherwise null.
     * @throws {Error} - Throws an error if passwords do not match.
     */
    async updateMigratingApplicant(email, passcode, username, password, confirmPassword){
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const migratingUser = await this.agentDAO.updateMigratingApplicant(email, passcode, username, hashedPassword);
        this.logger.log(`User ${email} reset account details.`);
        return migratingUser;
    }

    /**
     * Updates recruiter information such as email and personal number.
     * @param {number} person_id - The ID of the recruiter.
     * @param {string} email - The updated email address.
     * @param {string} pnr - The updated personal number.
     * @returns {Promise<Object|null>} - The updated recruiter data if successful, otherwise null.
     */
    async updateRecruiter(person_id, email, pnr){
        const recruiter = await this.agentDAO.updateRecruiter(person_id, email, pnr);
        this.logger.log(`Recruiter ${person_id} updated their details.`);
        return recruiter;
    }


}

module.exports = Controller;
