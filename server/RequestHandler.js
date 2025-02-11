const Controller = require('./Controller');

class RequestHandler {
    constructor() {
        this.controller = new Controller();
    }

    initializeRoutes(app) {
        //Get competencies (get)

        //Load previous application (get)

        //Create application (post)


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