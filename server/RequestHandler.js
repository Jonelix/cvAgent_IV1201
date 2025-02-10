const Controller = require('./Controller');

class RequestHandler {
    constructor() {
        this.controller = new Controller();
    }

    initializeRoutes(app) {
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
    }
}

module.exports = RequestHandler;