/**
 * RequestHandler - Handles API requests and routes.
 * Manages request validation, authentication, and communication with the Controller.
 */
const Controller = require('./Controller');
const Validation = require('./ServerValidation');

class RequestHandler {
    constructor() {
        this.controller = new Controller();
    }

    /**
     * Initializes all API routes.
     * @param {Object} app - The Express application instance.
     */
    initializeRoutes(app) {

        /**
         * GET /api/competencies
         * Retrieves all competencies.
         */
        app.get('/api/competencies', async (req, res) => {
            try {
                const competencies = await this.controller.competencies();
                if(!competencies) {
                    res.status(404).json({ message: 'No competencies found' });
                }else{
                    console.log("Com: ", competencies);
                    res.status(200).json(competencies);
                }

            } catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        });

        /**
         * POST /api/userCompetencies
         * Retrieves competencies for a specific user.
         */
        app.post('/api/userCompetencies', async (req, res) => {
            try {
                const { person_id } = req.body;

                if (!Validation.validateID(person_id)) {
                    return res.status(400).json({ message: 'Missing person_id' });
                }

                const userCompetencies = await this.controller.userCompetencies(person_id);
                if (!userCompetencies) {
                    res.status(404).json({ message: 'No user competencies found' });
                }else{
                    res.status(200).json(userCompetencies);
                }
            } catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        });

        /**
         * POST /api/userAvailability
         * Retrieves availability for a specific user.
         */
        app.post('/api/userAvailability', async (req, res) => {
          
         let user = await this.cookieCheck(req, res);
          const { person_id } = req.body;
          
          if (!Validation.validateID(person_id)) {
            return res.status(400).json({ message: 'Missing person_id' });
          }
          

       /*   console.log("in userAvailability:");
          console.log("user:");
          console.log(user);
          console.log("person_id");
          console.log(person_id);*/

          if(user == -1){
            return;
          }
          if(user.person_id == person_id){
            try {
                const { person_id } = req.body;
                if (!Validation.validateID(person_id)) {
                    return res.status(400).json({ message: 'Missing person_id' });
                }

                const userAvailability = await this.controller.userAvailability(person_id);
                if (!userAvailability) {
                    res.status(404).json({ message: 'No user availability found' });
                }else{
                    res.status(200).json(userAvailability);
                }
            } catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
          } else {
            res.status(403).json({message: 'Permission Denied'})
          }
        });

        /**
         * POST /api/fetchPerson
         * Retrieves a person's information based on first and last name.
         */
        app.post('/api/fetchPerson', async (req, res) => {
            try {
                const {firstName, lastName } = req.body;

                if (!Validation.validateName(firstName) || !Validation.validateName(lastName)) {
                    return res.status(400).json({ message: 'Missing first name or last name' });
                }

                const person = await this.controller.fetchPerson(firstName, lastName);
                if (!person) {
                    res.status(404).json({ message: 'No person found' });
                } else {
                    res.status(200).json(person);
                }
            } catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        });


        
         /**
         * Checks authentication status of the user.
         * @route GET /api/testAuth
         */
        app.get('/api/testAuth', async (req, res) => {
          try {
            //AUTH
            if (req.headers.cookie == null) {
              res.status(401).json({ message: 'Not logged in' });
            }


            const role_id = await this.controller.userRoleCheck(req.headers.cookie)

            res.status(200).json(role_id);

          } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
          }
        });

         /**
         * Retrieves all applicant profiles.
         * @route GET /api/applicantProfiles
         */
        app.get('/api/applicantProfiles', async (req, res) => {
          let user = await this.cookieCheck(req, res);
          if(user == -1){
            return;
          }
          console.log(user);
          if (user.role_id == 1) {
            try {
              const applicantProfiles = await this.controller.applicantProfiles();
              if (!applicantProfiles) {
                res.status(404).json({ message: 'No applicant profile found' });
              } else {
                res.status(200).json(applicantProfiles);
              }
            } catch (error) {
              res.status(500).json({ message: 'Server error', error: error.message });
            }
          } else {
            res.status(403).json({message: 'Permission Denied'})
          }
        });

        
        /**
         * Retrieves a specific applicant profile by ID.
         * @route POST /api/applicantProfile
         */
        app.post('/api/applicantProfile', async (req, res) => {
            try {
                const { applicant_id } = req.body;

                if(!Validation.validateID(applicant_id)) {
                    return res.status(400).json({ message: 'Missing applicant_id' });
                }

                const applicant = await this.controller.getApplicantProfile(applicant_id);

                if (!applicant || applicant.length === 0) {
                    return res.status(404).json({ message: 'Applicant not found' });
                }

                res.status(200).json({ data: applicant }); // Ensure it's returned inside an array
            } catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        });


        /**
         * POST /api/login
         * Handles user login and authentication.
         */
        app.post('/api/login', async (req, res) => {
          let user;
            if(req.headers.cookie != null){
              console.log("cookie case:");
              user = await this.controller.authenticateCookie(req.headers.cookie)
            } else {
              console.log("no cookie case:");
              const { username, password } = req.body;
              console.log("In login request handler:");
              console.log("username: " + username + " password: " + password);
               
              if(!Validation.validateUsername(username) || !Validation.validatePassword(password)){
                return res.status(401).json({ message: 'Incorrect username or password. Please try again.' });
            }
                user = await this.controller.login(username, password);
            }
            try {
              console.log("user found:");
              console.log(user);
                if (user) {
                  console.log("calling make cookie:");
                  const cookie = await this.controller.makeCookie(user);
                  delete user.password
                  const resp = {
                    user: user,
                    cookie: cookie
                  };
                  console.log("this runs");
                  console.log("login response:");
                  console.log(resp);
                    res.status(200).json(resp);
                } else {
                    res.status(401).json({ message: 'Incorrect username or password. Please try again.' });
                }
            } catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        });

        /**
         * POST /api/register
         * Handles user registration.
         */
        app.post('/api/register', async (req, res) => {
            const { firstName, lastName, personNumber, username, email, password, confirmPassword, role_id = 2 } = req.body;

            try {
                if (!Validation.validateName(firstName) || !Validation.validateName(lastName) || !Validation.validatePNR(personNumber) || !Validation.validateUsername(username) || !Validation.validateEmail(email) || !Validation.validatePassword(password) || !Validation.validatePassword(confirmPassword) || !role_id) {
                    return res.status(400).json({ message: 'All fields were not entered with valid information.' });
                }

                const user = await this.controller.register(firstName, lastName, personNumber, username, email, password, confirmPassword, role_id);
                res.status(201).json({ message: 'User registered successfully', user });
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    return res.status(400).json({ message: 'Username or email already exists' });
                }
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        });

        /**
         * Handles updating the applicant's status.
         * @route POST /api/handleApplicantStatus
         * @param {number} rec_id - Recruiter ID handling the status.
         * @param {number} app_id - Applicant ID whose status is being handled.
         * @param {number} timestamp - Timestamp of the request.
         */
        app.post('/api/handleApplicantStatus', async (req, res) => {
            const { rec_id, app_id, timestamp } = req.body;
            try {
                if (!Validation.validateID(rec_id) || !Validation.validateID(app_id) || !Validation.validateID(timestamp)) {
                    return res.status(400).json({ message: 'All fields are required' });
                }

                const user = await this.controller.handleApplicantStatus(rec_id, app_id, timestamp);
                res.status(201).json({ message: 'User status handling has been initiated', user });
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    return res.status(400).json({ message: 'Username or email already exists' });
                }
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        });

        /**
         * Confirms the status update of an applicant.
         * @route POST /api/confirmStatusUpdate
         * @param {number} rec_id - Recruiter ID.
         * @param {number} app_id - Applicant ID.
         * @param {number} status - New status of the applicant.
         */
        app.post('/api/confirmStatusUpdate', async (req, res) => {
            const { rec_id, app_id, status } = req.body;
            try {
                
                if (!Validation.validateID(rec_id) || !Validation.validateID(app_id) || !Validation.validateID(status)) {
                    return res.status(400).json({ message: 'All fields are required' });
                }
                const user = await this.controller.confirmStatusUpdate(rec_id, app_id, status);
                res.status(201).json({ message: 'User status handling has been initiated', user });
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    return res.status(400).json({ message: 'Username or email already exists' });
                }
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        });


         /**
         * Creates a new job application.
         * @route POST /api/createApplication
         * @param {number} person_id - ID of the person applying.
         * @param {Array} competencies - List of competencies.
         * @param {Array} availabilities - List of available time periods.
         */
        app.post('/api/createApplication', async (req, res) => {
            console.log("Started createApplication");
            const { person_id, competencies, availabilities } = req.body;
            try {
                console.log("Person_id: ", person_id, "Availability: ", availabilities, "Competencies: ", competencies);

                if(!Validation.validateID(person_id) || !Validation.validateArray(competencies) || !Validation.validateArray(availabilities)) {
                    console.log("Invalid input");
                    return res.status(400).json({ message: 'Invalid input' });
                }

                console.log("Valid input");
                const application = await this.controller.createApplication(
                    person_id,
                    competencies,
                    availabilities
                );
                console.log("Application created");

                if(application.errormessage){
                    return res.status(400).json({ message: application.errormessage });
                }

                res.status(201).json(application);
            } catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        });

        /**
         * Deletes a competence entry for a user.
         * @route POST /api/deleteCompetence
         * @param {number} person_id - ID of the person whose competence will be deleted.
         */
        app.post('/api/deleteCompetence', async (req, res) => {

            const {person_id} = req.body;
            try{
                if(!Validation.validateID(person_id)){
                    return res.status(400).json({ message: 'Invalid person ID' });
                }

                const application = await this.controller.deleteCompetence(person_id);
                res.status(201).json({ message: 'Competence deleted successfully', application });
            }catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        });

        /**
         * Deletes availability for a user.
         * @route POST /api/deleteAvailability
         * @param {number} person_id - ID of the person whose availability will be deleted.
         */
        app.post('/api/deleteAvailability', async (req, res) => {
            const {person_id} = req.body;
            try{
                if(!Validation.validateID(person_id)){
                    return res.status(400).json({ message: 'Invalid person ID' });
                }
                const application = await this.controller.deleteAvailability(person_id);
                res.status(201).json({ message: 'Application deleted successfully', application});
            }catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        });

        /**
         * Requests a security passcode for user authentication.
         * @route POST /api/requestPasscode
         * @param {string} email - User's email address.
         */
        app.post('/api/requestPasscode', async (req, res) => {
            const {email} = req.body;
            try{
                if(!Validation.validateEmail(email)){
                    return res.status(400).json({ message: 'Invalid email' });
                }
                const application = await this.controller.requestPasscode(email);
                res.status(201).json({ message: 'Security code was created', application });
            }catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        });

        /**
         * Confirms a security passcode.
         * @route POST /api/confirmPasscode
         * @param {string} email - User's email.
         * @param {string} passcode - Security passcode.
         */
        app.post('/api/confirmPasscode', async (req, res) => {
            const {email, passcode} = req.body;
            try{
                if(!Validation.validateEmail(email) || !Validation.validateID(passcode)){
                    return res.status(400).json({ message: 'Invalid email or passcode' });
                }
                const application = await this.controller.confirmPasscode(email, passcode);
                res.status(201).json({ message: 'Security code was confirmed', application });
            }catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
        }});

        /**
         * Updates an applicant's credentials after account migration.
         * @route POST /api/updateMigratingApplicant
         */
        app.post('/api/updateMigratingApplicant', async (req, res) => {
            const {email, passcode, username, password, confirmPassword} = req.body;
            try{
                if(!Validation.validateEmail(email) || !Validation.validateID(passcode) || !Validation.validateUsername(username) || !Validation.validatePassword(password) || !Validation.validatePassword(confirmPassword)){
                    return res.status(400).json({ message: 'Invalid email, passcode, username, password or confirm password' });
                }
                const application = await this.controller.updateMigratingApplicant(email, passcode, username, password, confirmPassword);
                res.status(201).json({ message: 'Applicant was updated', application });
            }catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        });

        
        /**
        * Updates a recruiter's email and personal number (PNR).
        * @route POST /api/updateRecruiter
        */
        app.post('/api/updateRecruiter', async (req, res) => {
            const {person_id, email, pnr} = req.body;
            try{
                if(!Validation.validateID(person_id) || !Validation.validateEmail(email) || !Validation.validatePNR(pnr)){
                    return res.status(400).json({ message: 'Invalid person ID, email or pnr' });
                }
                const application = await this.controller.updateRecruiter(person_id, email, pnr);
                res.status(201).json({ message: 'Recruiter was updated', application });
            }catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        });
    }

    /**
     * Checks the authentication cookie and validates the user session.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Promise<Object|number>} - Returns user data or -1 if authentication fails.
     */
    async cookieCheck(req, res){
              try {
                //AUTH
                if (req.headers.cookie == null) {
                  res.status(401).json({ message: 'Not logged in' });
                  return -1;
                }

                const user = await this.controller.checkUser(req.headers.cookie)

                if(user == -1){
                  res.status(401).json({ message: 'No such user' });
                  return -1;
                }

                return user;

              } catch (error){
                console.log("cookieCheck failed");
              }
            }
}

module.exports = RequestHandler;
