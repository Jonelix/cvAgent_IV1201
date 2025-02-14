const Controller = require('./Controller');

class RequestHandler {
    constructor() {
        this.controller = new Controller();
    }

    initializeRoutes(app) {
        //Get competencies (get)

        //Load previous application (get)

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
            const { firstName, lastName, personNumber, username, email, password, confirmPassword, role_id = 1 } = req.body;

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
    }
}

module.exports = RequestHandler;