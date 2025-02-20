# CV AGENT - A CV application for creating and reviewing CV's

## Decisions

### Architecture
**Monolith** - (Create Diagram) + Why?

**Frontend** - (Create Diagram) + Why?

**Databse** - (Create Diagram) + Why?

### Build tool
**Vite** Why?

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
How was migration handled?

### Authentification (+Password encryption)
How and why?

Passwords are sent from client to server in plaintext,
due to HTTPs already encrypting traffic.
Server hashes password and checks for hash in DB.



### Authorization
How and why?

### Backend GUI
Explanation needed on what they mean by this?

### Validation
**Server-side**
Validation of data will be done in the topmost layer possible and right before accessing the DB.

**Client-side**
Validation of data is done on login or account creation before data gets sent. 
This will lower load on server.

**Integration**

### Persistance


### CORS Policy

### Logging

### Internationality & Localization

### Concurrent application handling


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
**Vite** - Uploaded



## Non-Functional Requirements
- Availability
  - Should be easy to justify that Heroku provides the necesary tools to be available. 
- ~~Reliability~~
- ~~Response time~~
- Capacity
  - Should be easy to justify that Heroku provides the necesary tools to be available. 
- ~~Scalability~~
- ~~Manageability~~
- ~~Configureability~~
- ~~Packaging~~
- ~~Standard~~
- ~~Usability~~
- ~~Security~~
- ~~Design goals~~

## Technologies we are using

Frontend:
- React
- Tailwind
- Vite
- MobX
- npm

Backend:
- npm
- Node.js
- Express
- CORS
- DotEnv
- pg

Database:
- PostgreSQL



### Client Standards
#### Naming: 

#### Documentation: 

#### Unit tests: 

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
