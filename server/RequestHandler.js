const Controller = require('./Controller');

class RequestHandler {
    constructor() {
        this.controller = new Controller();
    }

    initializeRoutes(app) {
        
        //Create application (post)

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

        app.post('/api/userCompetencies', async (req, res) => {
            try {
                const { person_id } = req.body;
                if (!person_id) {
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

        app.post('/api/userAvailability', async (req, res) => {
            try {
                const { person_id } = req.body;
                if (!person_id) {
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
        });

        app.post('/api/fetchPerson', async (req, res) => {
            try {
                const {firstName, lastName } = req.body;

                if (!firstName || !lastName) {
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




        app.get('/api/applicantProfiles', async (req, res) => {
            try {
                const applicantProfiles = await this.controller.applicantProfiles();
                if (!applicantProfiles) {
                    res.status(404).json({ message: 'No applicant profile found' });
                }else{
                    res.status(200).json(applicantProfiles);
                }
            } catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        });

        app.post('/api/applicantProfile', async (req, res) => {
            try {
                const { applicant_id } = req.body;
        
                if (!applicant_id) {
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
        

        app.post('/api/login', async (req, res) => {
            const { username, password } = req.body;
            try {
                const user = await this.controller.login(username, password);
                if (user) {
                    res.status(200).json(user);
                } else {
                    res.status(401).json({ message: 'Invalid credentials' });
                }
            } catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        });

        app.post('/api/register', async (req, res) => {
            const { firstName, lastName, personNumber, username, email, password, confirmPassword, role_id = 2 } = req.body;

            try {
                if (!firstName || !lastName || !personNumber || !username || !email || !password || !confirmPassword || !role_id) {
                    return res.status(400).json({ message: 'All fields are required' });
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

        app.post('/api/handleApplicantStatus', async (req, res) => {
            const { rec_id, app_id, timestamp } = req.body;
            try {
                if (!rec_id || !app_id || !timestamp) {
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

        app.post('/api/confirmStatusUpdate', async (req, res) => {
            const { rec_id, app_id, status } = req.body;
            try {
                if (rec_id == null || app_id == null || status == null) {
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


        app.post('/api/createApplication', async (req, res) => {
            const { person_id, competencies, availabilities } = req.body;
            try {                    
                console.log("Person_id: ", person_id, "Availability: ", availabilities, "Competencies: ", competencies);
                if(!person_id || !availabilities?.length || !competencies?.length) {
                    return res.status(400).json({ message: 'All fields are required' });
                }
                
                const application = await this.controller.createApplication(
                    person_id, 
                    competencies, 
                    availabilities
                );
                
                res.status(201).json(application);
            } catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        });

        app.post('/api/deleteCompetence', async (req, res) => {
            const {person_id} = req.body;
            try{
                if(!person_id){
                    return res.status(400).json({ message: 'Person ID' });
                }
                const application = await this.controller.deleteCompetence(person_id);
                res.status(201).json({ message: 'Competence deleted successfully', application });
            }catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        });

        app.post('/api/deleteAvailability', async (req, res) => {
            const {person_id} = req.body;
            try{
                if(!person_id){
                    return res.status(400).json({ message: 'Person ID are required' });
                }
                const application = await this.controller.deleteAvailability(person_id);
                res.status(201).json({ message: 'Application deleted successfully', application});
            }catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        });

        app.post('/api/requestPasscode', async (req, res) => {
            const {email} = req.body;
            try{
                if(!email){
                    return res.status(400).json({ message: 'Email field missing' });
                }
                const application = await this.controller.requestPasscode(email);
                res.status(201).json({ message: 'Security code was created', application });
            }catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        });

        app.post('/api/confirmPasscode', async (req, res) => {
            const {email, passcode} = req.body;
            try{
                if(!email || !passcode){
                    return res.status(400).json({ message: 'Email or passcode field missing' });
                }
                const application = await this.controller.confirmPasscode(email, passcode);
                res.status(201).json({ message: 'Security code was confirmed', application });
            }catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
        }});

        app.post('/api/updateMigratingApplicant', async (req, res) => {
            const {email, passcode, username, password, confirmPassword} = req.body;
            try{
                if(!email || !passcode || !username || !password || !confirmPassword){
                    return res.status(400).json({ message: 'All fields are required' });
                }
                const application = await this.controller.updateMigratingApplicant(email, passcode, username, password, confirmPassword);
                res.status(201).json({ message: 'Applicant was updated', application });
            }catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        });

        app.post('/api/updateRecruiter', async (req, res) => {
            const {person_id, email, pnr} = req.body;
            try{
                if(!person_id || !email || !pnr){
                    return res.status(400).json({ message: 'All fields are required' });
                }
                const application = await this.controller.updateRecruiter(person_id, email, pnr);
                res.status(201).json({ message: 'Recruiter was updated', application });
            }catch (error) {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        });


    }
}

module.exports = RequestHandler;