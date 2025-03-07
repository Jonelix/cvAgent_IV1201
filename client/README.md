# IV1201 Project
Created by Jonathan Amdam, Joar Enekvist, Ratimir Ernman, and Ziang Wang

## Overview
The IV1201 project is a web application designed to manage CVs and applications efficiently. It consists of a client-side application built with React and a server-side application powered by Node.js and Express.

## Features
- User authentication and registration (JWT-based authentication)
- CV submission and management
- Recruiter and applicant roles
- Secure API with authentication
- Validation of user inputs including usernames, passwords, emails, and PNR numbers

## Installation
### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Clone the Repository
```sh
git clone https://github.com/your-repository/IV1201.git
cd IV1201
```

### Install Dependencies
#### Client
```sh
cd client
npm install
```

#### Server
```sh
cd server
npm install
```

## Usage
### Running the Development Server
#### Client
```sh
cd client
npm start
```

#### Server
```sh
cd server
npm start
```

By default, the client will run on `http://localhost:3000` and the server on `http://localhost:5000`.

## API Documentation
### Available Endpoints
#### Authentication
- **POST /api/login** - Handles user login and authentication
- **POST /api/register** - Handles user registration
- **POST /api/request-passcode** - Requests a security passcode for authentication
- **POST /api/confirm-passcode** - Confirms the provided passcode
- **GET /api/check-auth** - Checks authentication status of the user

#### User Data
- **GET /api/competencies** - Retrieves all competencies
- **POST /api/userCompetencies** - Retrieves competencies for a specific user
- **POST /api/userAvailability** - Retrieves availability for a specific user
- **POST /api/fetchPerson** - Retrieves a person’s profile based on name

#### Applications & Recruiter Actions
- **GET /api/applicants** - Retrieves all applicant profiles
- **GET /api/applicant/:id** - Retrieves a specific applicant profile
- **POST /api/updateStatus** - Updates an applicant’s status
- **POST /api/confirmStatus** - Confirms the status update of an applicant
- **POST /api/createApplication** - Creates a new job application
- **DELETE /api/deleteCompetence** - Deletes a competence entry for a user
- **DELETE /api/deleteAvailability** - Deletes availability for a user

## Backend Documentation
The server-side application is built using **Node.js and Express**, with **Sequelize ORM** for database interactions. Below is a breakdown of key modules:

### Server Structure
The backend is organized into the following key modules:
- **`server.js`** - The main entry point for the backend. It:
  - Loads environment variables.
  - Initializes middleware and CORS settings.
  - Serves static files from the frontend.
  - Configures API routes.
  - Starts the Express server.

### Controllers
Controllers handle business logic and user interactions:
- **`Controller.js`**
  - Manages authentication, registration, and profile management.
  - Handles user login and cookie-based authentication.
  - Manages job applications and recruiter actions.

### Data Access Layer
The **AgentDAO.js** module is responsible for database interactions:
- Retrieves and updates user profiles, competencies, and availability.
- Handles job applications and recruiter assignments.
- Manages authentication tokens and user sessions.

### Request Handling
The **RequestHandler.js** module defines API endpoints and routes:
- Routes requests to appropriate controllers.
- Implements input validation and authentication checks.

### Authentication
The **Authentication.js** module manages user authentication using **JWT tokens**:
- Generates and verifies JWT authentication cookies.
- Handles automatic user login via stored authentication cookies.

### Validation
The **ServerValidation.js** module ensures data integrity by validating:
- Usernames (minimum 6 alphanumeric characters).
- Passwords (must contain uppercase letters, numbers, and special characters).
- Emails (standard email format validation).
- PNR (12-digit personal identification number).

### Logging & Debugging
- **Logger.js**
  - Logs system messages and errors.
  - Ensures debugging information is available for troubleshooting.
- **Benchmark.js**
  - Measures API response times for performance optimization.

## Client Documentation
### Frontend Structure
- **`App.jsx`** - Initializes the application, setting up the main layout and integrating key components.
- **`main.jsx`** - Entry point of the React app, wraps `App` inside `HashRouter` for routing and renders it into the DOM.

### Presenters
Presenters act as the logic layer between the MobX store and the views, handling state updates and passing data to components.
- **ProfilePresenter.jsx** - Manages profile state and localization.
- **RegisterPresenter.jsx** - Handles user registration logic.
- **ApplicantPresenter.jsx** - Manages applicant data and localization.
- **RecruiterPresenter.jsx** - Handles recruiter dashboard logic.
- **AuthentificationPresenter.jsx** - Manages authentication logic.
- **DashboardPresenter.jsx** - Determines the correct dashboard view based on user role.
- **HeaderPresenter.jsx** - Controls the application header and navigation logic.
- **FooterPresenter.jsx** - Manages footer localization.
- **MigrationPresenter.jsx** - Handles the user migration process.

### Views
Views are responsible for displaying the UI and interacting with the Presenters.
- **ProfileView.jsx** - Displays and manages user profile information.
- **HomeView.jsx** - Displays the home screen.
- **RegisterView.jsx** - Handles user registration and validation.
- **AuthentificationView.jsx** - Manages login and authentication.
- **ApplicantView.jsx** - Handles the applicant process and form submissions.
- **RecruiterView.jsx** - Displays and manages applicants for recruiters.
- **MigrationView.jsx** - Manages user migration and account setup.
- **HeaderView.jsx** - Displays the navigation header.
- **FooterView.jsx** - Displays the application footer.
- **MainView.jsx** - Serves as the container for rendering other views.

## Authentication
The project uses JWT-based authentication:
1. **Login Process** - Users log in via `/api/login`, receiving a JWT token stored in cookies.
2. **Session Validation** - The token is validated on secure API requests to ensure session persistence.
3. **Passcode Recovery** - Users can request and confirm passcodes for account recovery.

## Database Management
The backend uses Sequelize ORM to interact with the database. The `AgentDAO` module provides the following functions:
- **User Management:** Registering users, retrieving profiles, and handling authentication.
- **Competencies Management:** Fetching and updating user competencies.
- **Application Processing:** Handling job applications and recruiter assignments.
- **Authentication Cookie Management:** Inserting, validating, and deleting authentication cookies.

## Contributing
1. Fork the repository.
2. Create a new branch (`feature/your-feature-name`).
3. Commit your changes.
4. Push to your branch.
5. Submit a pull request.

## License
This project is licensed under the MIT License. See `LICENSE` for details.

