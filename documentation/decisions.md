# CV AGENT - A CV application for creating and reviewing CV's

## Decisions

### Architecture
We have decided that for our application a monolithic architecture is the most appropriate. This is because it doesn't need different services rather only serve on single prupose, to create and review CV's. Therefore we build our service around the CV. 

Our application can be sepparated into three main sections: client, server and database. The client, built in the React framework, is where the users, both recruiters and applcants, are servered the corresponding data from our servers. The website is rendered at the client so the server only has to handle data requests from the users.

The server server the web client and handles data requests from the client. It is scalable vertically and horizontallty. This way if it is desired to handle a higher number of requests you just have to augment the number of servers or you can implement new servers that are able to server other platforms like mobile.

The last section of the stack is the database, which communicates with the server and stores information on the applicants and recruiters.

### Build tool
**Vite** We chose Vite as our build tool since it is a tool we are familiar with after using it in other courses at KTH. 

### Version Control
**Git & GitHub** Is is the industry standard when in comes to version control and everyone has some familiarity with it.

### Deployment
**Heroku** It was the site recommended by the course and uppon looking into it inculded everything we needed to implement and scale the service, both with a backend server and database support. 

### IDE
**VS Code**
All developers on the team are familiar with and using this IDE and therefore we chose it. 

### Database
**Implementation**
What database are we using?
We are using a PostgreSQL server hosted on the Heroku platform. 

**Data migration**
We decided to not alter the already existing database too much, rather to develop on it. We have created new tables like __applicationstatus__ which handles the status of applciations and which recruiters it is being handled by.

### Authentification (+Password encryption)
Passwords are sent from client to server in plaintext,
due to HTTPs already encrypting traffic.
Server hashes password and checks for hash in DB.



### Authorization
We use cookies to store the state of a user session and we store it in the database as well and compare validated sessions with the server to make sure that the user's priviliges correspond to the changes he is allowed to make.


### Validation
**Server-side**
Validation of data will be done in the topmost layer possible. In our case this corresponds to the RequestHandler and 

**Client-side**
Validation of data is done on login or account creation before data gets sent. The input on the front-end includes validation for all fields.

**Integration**
We run another validation before sending requests to the server, this way we have another layer of security.

### Persistance
We use cookies to make sure we can store our users session. 

### CORS Policy
We have set our policy to only accept requests from our domain and our localhost address which we test on.

### Logging
We log all the main events to our heroku log. There we timestamp events and we can see when users log in, when a new user registers, when a recruiter updates an application status or when a new application is created.

### Internationality & Localization
We handle interntionalization with a JSON with all the strings and display them dynamically depending on the requested language. At this point the only languages added are english and spanish. 

### Concurrent application handling
When an applicantion is being handled we store the id of the recruiter handling the application so no other recruiters can update it simultaneously. 


### Code writing
**Coding**
When it comes to coding we follow:
- Variables & Methods: camelCasing
- Files: PascalCasing
**Documentation**
Here is a example of how to document a method or object. 
>```
>/**
> \* Adds two numbers and returns the result.
> \* @param {number} a - The first number.
> \* @param {number} b - The second number.
> \* @returns {number} - The sum of a and b.
> */
>function add(a, b) {
>    return a + b;
>}
>```

### Consistent GUI components
Header, footer and main body. Why?

### Canvas Links
**Vite**

**MobX**

**bcrypt**



## Non-Functional Requirements
- Response time
- Capacity

## Technologies we are using

Frontend:
- React
- Tailwind
- Vite
- MobX
- npm
- MUI Material

Backend:
- npm
- Node.js
- Express
- CORS
- DotEnv
- pg
- cls-hooked
- cookie-parser
- jsonwebtoken
- sequelize
- verror

Database:
- PostgreSQL



### Client Standards

#### Structure:
Model, View, Presenter.

Model should have all data saved for current session. ? 

View should have as little logic as possible. 

Presenter handels CORS req, and data validation.

model is passed through Presenter to view via ... to fix model.model.

## Meeting 2025/12/2

We are spliiting up the work until the next report.
Go through what have been done to this point so all members in the group understand
We are togheter deciding on how we will design and construct the dashboard for applicants and reqruiters aswell as the specified applicant page (view) and how the data will be updated / fetched.
