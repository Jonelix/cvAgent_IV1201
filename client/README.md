# IV1201 Project

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

## Client Documentation
### Frontend Structure
- **`App.jsx`** - Initializes the application, setting up the main layout and integrating key components.
- **`main.jsx`** - Entry point of the React app, wraps `App` inside `HashRouter` for routing and renders it into the DOM.

### Presenters
Presenters act as the logic layer between the MobX store and the views, handling state updates and passing data to components.
- **`ProfilePresenter.jsx`** - Manages profile state and localization, updates user data, and redirects on login.
- **`RegisterPresenter.jsx`** - Manages state and localization for user registration.
- **`ApplicantPresenter.jsx`** - Handles applicant data, observes MobX store, and updates localization dynamically.
- **`RecruiterPresenter.jsx`** - Manages recruiter dashboard state and provides applicants data.
- **`AuthentificationPresenter.jsx`** - Handles authentication logic, updates user data, and manages login success.
- **`DashboardPresenter.jsx`** - Displays recruiter or applicant views based on user role.
- **`HeaderPresenter.jsx`** - Manages header state and updates localization dynamically.
- **`FooterPresenter.jsx`** - Handles localization and passes updated strings to the footer component.
- **`MigrationPresenter.jsx`** - Manages the migration process, including passcode verification and user updates.

### Views
Views are responsible for displaying the UI and interacting with the Presenters.
- **`ProfileView.jsx`** - Displays and allows editing of user profile information.
- **`HomeView.jsx`** - Displays the home screen.
- **`RegisterView.jsx`** - Handles user registration, validation, and API submission.
- **`AuthentificationView.jsx`** - Manages user login and authentication.
- **`ApplicantView.jsx`** - Manages the user application process, including competencies and availabilities.
- **`RecruiterView.jsx`** - Displays and manages applicants for recruiters.
- **`MigrationView.jsx`** - Handles user migration by verifying passcodes and setting up accounts.
- **`HeaderView.jsx`** - Displays the application header with navigation options.
- **`FooterView.jsx`** - Displays the application footer.
- **`MainView.jsx`** - Serves as the container for rendering child components.

### Models
Models manage the state and data persistence of the application using MobX.
- **`applicantsModel.js`** - Handles applicant and user data:
  - Stores a list of applicants.
  - Maintains logged-in user details.
  - Provides methods to update the applicant list and user data dynamically.
  - Uses MobX for reactive state management.

### Validation Utilities
- **`FrontendValidation.js`** - Provides validation methods:
  - `validateName()` - Ensures names contain only letters, spaces, and hyphens.
  - `validateUsername()` - Enforces a minimum length and alphanumeric characters.
  - `validatePassword()` - Checks for uppercase letters, numbers, and special characters.
  - `validatePNR()` - Verifies a 12-digit personal number.
  - `validateEmail()` - Ensures standard email formatting.

### Configuration
- **`vite.config.js`** - Defines the build process and optimizations for the frontend.
- **`eslint.config.js`** - Configures linting rules for the project to enforce code quality.

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

## Validation Rules
The `ServerValidation.js` module ensures user input meets the following criteria:
- **Username:** At least 6 alphanumeric characters
- **Password:** Must contain an uppercase letter, a number, and a special character
- **Email:** Validates standard email format
- **PNR:** Exactly 12 digits

## Contributing
1. Fork the repository.
2. Create a new branch (`feature/your-feature-name`).
3. Commit your changes.
4. Push to your branch.
5. Submit a pull request.

## License
This project is licensed under the MIT License. See `LICENSE` for details.

