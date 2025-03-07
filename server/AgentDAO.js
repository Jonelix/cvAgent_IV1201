/**
 * AgentDAO - Data Access Object for handling database interactions.
 * Provides methods to interact with the 'person', 'competence', and 'applicationStatus' tables.
 * Utilizes Sequelize ORM for database queries.
 */
const { Sequelize, DataTypes } = require('sequelize');
const Validation = require('./ServerValidation');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const database = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {host: process.env.DB_HOST, dialect: 'postgres', dialectOptions: {
      ssl: {require: true, rejectUnauthorized: false}
        },
        logging: false // Disable query logging
    });

const Person = database.define('person', {
    person_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: true },
    surname: { type: DataTypes.STRING, allowNull: true },
    pnr: { type: DataTypes.STRING, allowNull: true, unique: true },
    email: { type: DataTypes.STRING, allowNull: true, unique: true },
    password: { type: DataTypes.STRING, allowNull: true },
    role_id: { type: DataTypes.INTEGER, allowNull: true },
    username: { type: DataTypes.STRING, allowNull: true, unique: true },
    recovery_token: { type: DataTypes.STRING, allowNull: true }
}, {
    tableName: 'person', // Ensure Sequelize does not pluralize the table name
    timestamps: false     // Disable automatic createdAt/updatedAt columns if not needed
});

const Competence = database.define('competence', {
    competence_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: true }
},{
    tableName: 'competence',
    timestamps: false     // Disable automatic createdAt/updatedAt columns if not needed
});

const ApplicationStatus = database.define('applicationstatus', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    person_id: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    timeout: { type: DataTypes.DATE, allowNull: true, defaultValue: null  },
    beinghandled: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null  }
}, {
    tableName: 'applicationstatus',
    timestamps: false
});

(async () => {
    await database.sync({ force: false }); // Adjust as needed
})();

class AgentDAO {
    /**
     * Finds a user by their username.
     * @param {string} username - The username to search for.
     * @returns {Promise<Object|null>} - Returns the user object or null if not found.
     */
    async findUserWithUsername(username) {
        if(!Validation.validateUsername(username)) {
            return null;
        }
        return await Person.findOne({ where: { username } });
    }

    /**
     * Registers a new user.
     * @param {string} firstName - First name of the user.
     * @param {string} lastName - Last name of the user.
     * @param {string} personNumber - Unique personal number.
     * @param {string} username - Chosen username.
     * @param {string} email - Email address.
     * @param {string} password - User password.
     * @param {number} role_id - Role ID of the user.
     * @returns {Promise<Object|null>} - The created user object or null if validation fails.
     */
    async registerUser(firstName, lastName, personNumber, username, email, password, role_id) {
        
        if(!Validation.validateName(firstName) || !Validation.validateName(lastName) || !Validation.validatePNR(personNumber) || !Validation.validateUsername(username) || !Validation.validateEmail(email)) {

            return null;
        }

        return await Person.create({ 
            name: firstName, 
            surname: lastName, 
            pnr: personNumber,   
            username, 
            email, 
            password: password, 
            role_id 
        });
    }

    /**
     * Retrieves all competencies from the database.
     * @returns {Promise<Array>} - An array of competencies.
     */
    async getCompetencies() {
        const competencies = await database.query('SELECT * FROM competence', { type: database.QueryTypes.SELECT });
        return competencies;
        
    }
    
     /**
     * Retrieves applicant profiles with competencies and availability.
     * @returns {Promise<Array>} - List of applicant profiles.
     */
    async getApplicantProfiles() {
        const applicant = await database.query(
            `
            SELECT 
                p.person_id, 
                p.name AS person_name, 
                p.surname, 
                COALESCE(
                    JSON_AGG(
                        DISTINCT JSONB_BUILD_OBJECT(
                            'competence_name', c.name, 
                            'years_of_experience', cp.years_of_experience
                        )
                    ) FILTER (WHERE c.name IS NOT NULL), 
                    '[]'
                ) AS competencies,
                COALESCE(
                    JSON_AGG(
                        DISTINCT JSONB_BUILD_ARRAY(avail.from_date, avail.to_date)
                    ) FILTER (WHERE avail.from_date IS NOT NULL), 
                    '[]'
                ) AS availability,
                appStatus.status,
                appStatus.beingHandled,
                appStatus.timeout
            FROM competence_profile cp
            JOIN person p ON cp.person_id = p.person_id
            JOIN competence c ON cp.competence_id = c.competence_id
            LEFT JOIN availability avail ON p.person_id = avail.person_id
            LEFT JOIN applicationStatus appStatus ON p.person_id = appStatus.person_id
            GROUP BY p.person_id, p.name, p.surname, appStatus.status, appStatus.beingHandled, appStatus.timeout;
            `,  
            { type: database.QueryTypes.SELECT }
        );   
        return applicant;
    }

    /**
     * Retrieves a specific applicant's profile.
     * @param {number} personId - The ID of the applicant.
     * @returns {Promise<Array>} - Applicant profile data.
     */
    async getApplicantProfile(personId) {
        if(!Validation.validateID(personId)) {
            return [];
        }
        // Check if the provided ID corresponds to a person with role_id = 2
        const personRole = await database.query(
            `
            SELECT role_id FROM person WHERE person_id = :personId
            `,  
            { 
                replacements: { personId },
                type: database.QueryTypes.SELECT 
            }
        );
    
        // If no person found or not role_id = 2, return an empty array
        if (!personRole.length || personRole[0].role_id !== 2) {
            return [];
        }
    
        // Fetch the profile for the applicant with the given personId
        const applicant = await database.query(
            `
            SELECT 
                p.person_id, 
                p.name AS person_name, 
                p.surname, 
                COALESCE(
                    JSON_AGG(
                        DISTINCT JSONB_BUILD_OBJECT(
                            'competence_name', c.name, 
                            'years_of_experience', cp.years_of_experience
                        )
                    ) FILTER (WHERE c.name IS NOT NULL), 
                    '[]'
                ) AS competencies,
                COALESCE(
                    JSON_AGG(
                        DISTINCT JSONB_BUILD_ARRAY(avail.from_date, avail.to_date)
                    ) FILTER (WHERE avail.from_date IS NOT NULL), 
                    '[]'
                ) AS availability,
                appStatus.status,
                appStatus.beingHandled,
                appStatus.timeout
            FROM person p
            LEFT JOIN competence_profile cp ON p.person_id = cp.person_id
            LEFT JOIN competence c ON cp.competence_id = c.competence_id
            LEFT JOIN availability avail ON p.person_id = avail.person_id
            LEFT JOIN applicationStatus appStatus ON p.person_id = appStatus.person_id
            WHERE p.person_id = :personId AND p.role_id = 2
            GROUP BY p.person_id, p.name, p.surname, appStatus.status, appStatus.beingHandled, appStatus.timeout;
            `,  
            { 
                replacements: { personId },
                type: database.QueryTypes.SELECT 
            }
        );
    
        return applicant;
    }
    
     /**
     * Assigns an application to a recruiter for handling.
     * @param {number} rec_id - The ID of the recruiter.
     * @param {number} app_id - The ID of the application.
     * @returns {Promise<string>} - A message indicating the result of the operation.
     */
    async handleApplicantStatus(rec_id, app_id) {
        if(!Validation.validateID(rec_id) || !Validation.validateID(app_id)) {
            return "Invalid identifiers provided.";
        }
        const application = await database.query(
            `
            WITH selected_application AS (
                SELECT 
                    person_id, 
                    beingHandled
                FROM applicationStatus
                WHERE person_id = :app_id
                LIMIT 1
            )
            SELECT 
                CASE 
                    WHEN sa.beingHandled IS NOT NULL AND sa.beingHandled != :rec_id 
                    THEN 'This application is being handled by another user'
                    ELSE NULL
                END AS message
            FROM selected_application sa;
            `,
            { 
                replacements: { rec_id, app_id },
                type: database.QueryTypes.SELECT
            }
        );
    
        if (application.length > 0 && application[0].message) {
            return application[0].message;
        }
    
        // If beingHandled is NULL, update it with rec_id
        await database.query(
            `
            UPDATE applicationStatus
            SET beingHandled = :rec_id
            WHERE person_id = :app_id AND beingHandled IS NULL;
            `,
            { 
                replacements: { rec_id, app_id },
                type: database.QueryTypes.UPDATE
            }
        );
    
        return "Application is now being handled by you.";
    }
    
    /**
     * Confirms an update to an application's status.
     * @param {number} rec_id - The ID of the recruiter handling the application.
     * @param {number} app_id - The ID of the application.
     * @param {number} status - The new status to be set.
     * @returns {Promise<string>} - A message indicating the result of the update.
     */
    async confirmStatusUpdate(rec_id, app_id, status) {
        if(!Validation.validateID(rec_id) || !Validation.validateID(app_id) || !Validation.validateID(status)) {
            return "Invalid identifiers or status provided.";
        }
        const application = await database.query(
            `
            WITH selected_application AS (
                SELECT 
                    person_id, 
                    beingHandled
                FROM applicationStatus
                WHERE person_id = :app_id
                LIMIT 1
            )
            SELECT 
                CASE 
                    WHEN sa.beingHandled IS NOT NULL AND sa.beingHandled != :rec_id 
                    THEN 'This application is being handled by another user'
                    ELSE NULL
                END AS message
            FROM selected_application sa;
            `,
            { 
                replacements: { rec_id, app_id },
                type: database.QueryTypes.SELECT
            }
        );
    
        if (application.length > 0 && application[0].message) {
            return application[0].message;
        }
    
        // If beingHandled matches rec_id, update the status and set beingHandled to NULL
        const result = await database.query(
            `
            UPDATE applicationStatus
            SET status = :status, beingHandled = NULL
            WHERE person_id = :app_id AND beingHandled = :rec_id;
            `,
            { 
                replacements: { rec_id, app_id, status },
                type: database.QueryTypes.UPDATE
            }
        );
    
        if (result[1] === 0) {
            return "Failed to update status. Either the application was not assigned to you or it was already released.";
        }
    
        return "Application status updated successfully.";
    }

    /**
     * Fetches a person by their first and last name.
     * @param {string} firstName - The first name of the person.
     * @param {string} lastName - The last name of the person.
     * @returns {Promise<Array>} - An array of matching persons.
     */
    async fetchPerson(firstName, lastName) {
        if(!Validation.validateName(firstName) || !Validation.validateName(lastName)) {
            return [];
        }
        const query = `SELECT * FROM person WHERE name = :firstName AND surname = :lastName`;
    
        try {
            const result = await database.query(query, {
                replacements: { firstName, lastName },
                type: database.QueryTypes.SELECT
            });
            
            return result;
        } catch (error) {
            console.error('Error fetching person:', error);
            throw error;
        }
    }
    
    /**
     * Fetches the competencies of a user by person ID.
     * @param {number} person_id - The ID of the user.
     * @returns {Promise<Array>} - An array of the user's competencies.
     */
    async getUserCompetencies(person_id) {
        if(!Validation.validateID(person_id)) {
            return [];
        }
        const query = `
            SELECT 
                c.name AS competence_name, 
                cp.years_of_experience
            FROM competence_profile cp
            JOIN competence c ON cp.competence_id = c.competence_id
            WHERE cp.person_id = :person_id;
        `;
    
        try {
            const result = await database.query(query, {
                replacements: { person_id },
                type: database.QueryTypes.SELECT
            });
            
            return result;
        } catch (error) {
            console.error('Error fetching user competencies:', error);
            throw error;
        }
    }

    /**
     * Fetches the availability of a user by person ID.
     * @param {number} person_id - The ID of the user.
     * @returns {Promise<Array>} - An array of the user's availability periods.
     */
    async getUserAvailability(person_id) {
        if(!Validation.validateID(person_id)) {
            return [];
        }
        const query = `
            SELECT 
                from_date, 
                to_date
            FROM availability
            WHERE person_id = :person_id;
        `;
    
        try {
            const result = await database.query(query, {
                replacements: { person_id },
                type: database.QueryTypes.SELECT
            });
            
            return result;
        } catch (error) {
            console.error('Error fetching user availability:', error);
            throw error;
        }
    }

     /**
     * Fetches the ID of a given competence by name.
     * @param {string} competence - The name of the competence.
     * @returns {Promise<number|null>} - The competence ID or null if not found.
     */
    async fetchCompetenceId(competence) {
        if(!Validation.validateName(competence)) {
            return null;
        }
        const query = `SELECT competence_id FROM competence WHERE name = :competence`;
    
        try {
            const result = await database.query(query, {
                replacements: { competence },
                type: database.QueryTypes.SELECT
            });
            if (!result.length) {
                throw new Error(`Competence "${competence}" not found`);
            }
            return result[0].competence_id;  
        }catch (error) {
        console.error('Error fetching competence id:', error);
        throw error;
    }
    }


    /*
    async createApplication(person_id, competence_id, years_of_experience, from_date, to_date) {
        return await database.query(
            `
            INSERT INTO competence_profile (person_id, competence_id, years_of_experience)
            VALUES (:person_id, :competence_id, :years_of_experience);
            INSERT INTO availability (person_id, from_date, to_date)
            VALUES (:person_id, :from_date, :to_date);
            `,
            { 
                replacements: { person_id, competence_id, years_of_experience, from_date, to_date },
                type: database.QueryTypes.INSERT
            }
        );
    }
        */

     /**
     * Creates a job application for a user, including competencies and availability.
     * Processes competencies by either inserting new entries or updating existing ones.
     * Ensures that availability periods do not contain duplicates before inserting new records.
     * @param {number} person_id - The ID of the person submitting the application.
     * @param {Array} competencies - An array of competencies including competence name and years of experience.
     * @param {Array} availabilityList - An array of availability periods.
     * @returns {Promise<Object>} - A success message or an error message if something fails.
     */
    async createApplication(person_id, competencies, availabilityList) {
        if(!Validation.validateID(person_id)) {
            return null;
        }
    const transaction = await database.transaction();

    try {
        console.log("DB: CREATING APPLCIAITON")
        // Process all competencies
        for (const comp of competencies) {
            const competence_id = await this.fetchCompetenceId(comp.competence_name);
            if (!competence_id) {
                await transaction.rollback();
                throw new Error(`Competence "${comp.competence_name}" not found in DB.`);
            }

            // Check if competence exists for this user
            const competenceExists = await database.query(
                `SELECT competence_id FROM competence_profile 
                 WHERE person_id = :person_id AND competence_id = :competence_id`,
                {
                    replacements: { person_id, competence_id },
                    type: database.QueryTypes.SELECT,
                    transaction
                }
            );

            if (competenceExists.length > 0) {
                // Update existing competence
                await database.query(
                    `UPDATE competence_profile 
                     SET years_of_experience = :years 
                     WHERE person_id = :person_id AND competence_id = :competence_id`,
                    {
                        replacements: { 
                            person_id, 
                            competence_id, 
                            years: comp.years_of_experience 
                        },
                        type: database.QueryTypes.UPDATE,
                        transaction
                    }
                );
            } else {
                // Insert new competence
                await database.query(
                    `INSERT INTO competence_profile 
                     (person_id, competence_id, years_of_experience)
                     VALUES (:person_id, :competence_id, :years)`,
                    {
                        replacements: { 
                            person_id, 
                            competence_id, 
                            years: comp.years_of_experience 
                        },
                        type: database.QueryTypes.INSERT,
                        transaction
                    }
                );
            }
        }

        // Check existing availability
        const availabilityCheckQuery = `
            SELECT availability_id, from_date, to_date FROM availability
            WHERE person_id = :person_id;
        `;

        const availabilityExists = await database.query(availabilityCheckQuery, {
            replacements: { person_id },
            type: database.QueryTypes.SELECT,
            transaction
        });

        let availabilityUpdated = false;

        for (let newAvailability of availabilityList) { // Loop through new availability array
            for (let availability of availabilityExists) { // Loop through existing availability
                // Scenario 1: If from_date and to_date match, return
                if (new Date(newAvailability.from_date).toISOString() === new Date(availability.from_date).toISOString() && 
                    new Date(newAvailability.to_date).toISOString() === new Date(availability.to_date).toISOString()) {
                    await transaction.rollback();
                    return { errormessage: 'One of the availabilities you entered already exists in our database. Please check for duplicates.' };                    
                    /*return { 
                        errormessage: 'One of the availabilities you entered already exists in our database. Please check for duplicates.',  
                    };   */        
                }

                // Scenario 2: If either from_date or to_date match, update the row
                if(new Date(newAvailability.from_date).toISOString() === new Date(availability.from_date).toISOString() || 
                    new Date(newAvailability.to_date).toISOString() === new Date(availability.to_date).toISOString()) {
                    const updateAvailabilityQuery = `
                        UPDATE availability
                        SET from_date = :from_date, to_date = :to_date
                        WHERE person_id = :person_id AND availability_id = :availability_id;
                    `;

                    await database.query(updateAvailabilityQuery, {
                        replacements: {
                            person_id,
                            from_date: newAvailability.from_date,
                            to_date: newAvailability.to_date,
                            availability_id: availability.availability_id
                        },
                        type: database.QueryTypes.UPDATE,
                        transaction
                    });

                    // Set flag to true and break the loop
                    availabilityUpdated = true;
                    break;
                }

            }

        // Scenario 3: If no match was found, insert a new row
        if (!availabilityUpdated) {
            const availabilityInsert = `
            INSERT INTO availability (person_id, from_date, to_date)
            VALUES (:person_id, :from_date, :to_date);
            `;

            await database.query(availabilityInsert, {
                replacements: { person_id, from_date: newAvailability.from_date, to_date: newAvailability.to_date},
                type: database.QueryTypes.INSERT,
                transaction
            });
        }
    }
        
        // Insert application status
        const applicationStatusInsert = `
            INSERT INTO applicationstatus (person_id, status, timeout, beinghandled)
            VALUES (:person_id, 0, NULL, NULL);
        `;

        await database.query(applicationStatusInsert, {
            replacements: { person_id },
            type: database.QueryTypes.INSERT,
            transaction
        });
        console.log("DB: COMMITING TRANSACTION")
        await transaction.commit();
        return { message: 'Application successfully processed!' };
    } catch (error) {
        await transaction.rollback();
        console.error('Error creating application:', error);
        throw error;
    }
}

    /**
     * Deletes all competencies associated with a specific person ID.
     * @param {number} person_id - The ID of the person.
     * @returns {Promise<Object>} - Result of the deletion query.
     */
    async deleteCompetence(person_id) {
        if(!Validation.validateID(person_id)) {
            return null;
        }
        const query = `
            DELETE FROM competence_profile
            WHERE person_id = :person_id;
        `;

        try{
            const result = await
            database.query(query, {
                replacements: { person_id },
                type: database.QueryTypes.DELETE
            });
            return result;
        }catch(error){
            console.error('Error deleting competence:', error);
            throw error;
        }
    }

    /**
     * Deletes all availability periods associated with a specific person ID.
     * @param {number} person_id - The ID of the person.
     * @returns {Promise<Object>} - Result of the deletion query.
     */
    async deleteAvailability(person_id) {
        if(!Validation.validateID(person_id)) {
            return null;
        }
        const query = `
            DELETE FROM availability
            WHERE person_id = :person_id;
        `;

        try{
            const result = await database.query(query, {
                replacements: { person_id },
                type: database.QueryTypes.DELETE
            });
            return result;
        }catch(error){
            console.error('Error deleting availability:', error);
            throw error;
        }
    }

    /**
     * Requests a passcode for password recovery.
     * @param {string} email - The email of the user requesting a passcode.
     * @param {number} securityCode - The security code to be assigned.
     * @returns {Promise<Object|null>} - Updated user object or null if not found.
     */
    async requestPasscode(email, securityCode) {
        if(!Validation.validateEmail(email)) {
            return null;
        }
        try {
            // Find the user by email
            const user = await Person.findOne({ where: { email } });
    
            if (!user) {
                console.error(`User with email ${email} not found.`);
                return null; // or throw an error depending on your logic
            }
    
            // Update the recovery_token field
            user.recovery_token = securityCode;
            await user.save();
    
            console.log(`Recovery token updated for ${email}`);
            return user; // return updated user if needed
        } catch (error) {
            console.error('Error updating recovery token:', error);
            throw error;
        }
    }

    /**
     * Confirms the provided passcode for account recovery.
     * @param {string} email - The email associated with the recovery request.
     * @param {number} securityCode - The security code provided by the user.
     * @returns {Promise<Object|null>} - User object if verification is successful, otherwise null.
     */
    async confirmPasscode(email, securityCode) {
        if(!Validation.validateEmail(email)) {
            return null;
        }
        try {
            // Find the user by email and recovery_token
            const user = await Person.findOne({ where: { email, recovery_token: securityCode } });
    
            if (!user) {
                console.error(`User with email ${email} and recovery token ${securityCode} not found.`);
                return null; // or throw an error depending on your logic
            }
    
            console.log(`Recovery token confirmed for ${email}`);
            return user; // return user if needed
        } catch (error) {
            console.error('Error confirming recovery token:', error);
            throw error;
        }
    }

    /**
     * Updates a migrating applicant's username and password.
     * @param {string} email - Email of the user.
     * @param {number} securityCode - Security code for verification.
     * @param {string} username - New username.
     * @param {string} password - New password.
     * @returns {Promise<Object|null>} - Updated user object or null if validation fails.
     */
    async updateMigratingApplicant(email, securityCode, username, password) {
        if(!Validation.validateEmail(email) || !Validation.validateUsername(username) ) {
            return null;
        }
        try {
                // Find the user by email and recovery_token
                const user = await Person.findOne({ where: { email, recovery_token: securityCode } });
        
                if (!user) {
                    console.error(`User with email ${email} and recovery token ${securityCode} not found.`);
                    return null; // or throw an error depending on your logic
                }
        
                // Update the user's username and password
                user.username = username;
                user.password = password;
                await user.save();
        
                //console.log(`User ${email} updated with username and password`);
                return user; // return updated user if needed
        } catch (error) {
                //console.error('Error updating username and password:', error);
                throw error;
        }
    }

    /**
     * Updates a recruiter's email and personal number.
     * @param {number} person_id - The ID of the recruiter.
     * @param {string} email - The new email of the recruiter.
     * @param {string} pnr - The new personal number of the recruiter.
     * @returns {Promise<Object|null>} - The updated recruiter object or null if not found.
     */
    async updateRecruiter(person_id, email, pnr) {
        if(!Validation.validateID(person_id) || !Validation.validateEmail(email) || !Validation.validatePNR(pnr)) {
            return null;
        }
        try {
            // Find the recruiter by person_id
            const recruiter = await Person.findOne({ where: { person_id } });
    
            if (!recruiter) {
                console.error(`Recruiter with person_id ${person_id} not found.`);
                return null; // or throw an error depending on your logic
            }
    
            // Update the recruiter's email and pnr
            recruiter.email = email;
            recruiter.pnr = pnr;
            await recruiter.save();
    
            console.log(`Recruiter ${person_id} updated with email and pnr`);
            return recruiter; // return updated recruiter if needed
        } catch (error) {
            console.error('Error updating email and pnr:', error);
            throw error;
        }
    }

    /**
     * Inserts a cookie into the database.
     * @param {string} cookie - The cookie string to store.
     * @returns {Promise<Object>} - Result of the insert query.
     */
    async insertCookie(cookie) {
      /*  if(!Validation.validateCookie(cookie)) {
            return null;
        }*/
        try {
            const result = await database.query(
                `INSERT INTO cookie_table (cookie_string, timestamp) VALUES (:cookie, :timestamp)`,
                { 
                    replacements: { 
                        cookie, 
                        timestamp: Math.floor(Date.now() / 1000) // Current Unix timestamp
                    }, 
                    type: database.QueryTypes.INSERT 
                }
            );
            return result;
        } catch (error) {
            console.error('Error inserting cookie:', error);
            throw error;
        }
    }

    /**
     * Checks if a given cookie exists in the database.
     * @param {string} cookie - The cookie string to verify.
     * @returns {Promise<Object|null>} - The cookie record if found, otherwise null.
     */
    async checkCookie(cookie) {
       /* if(!Validation.validateCookie(cookie)) {
            return null;
        }*/
        try {
            console.log("Executing query:", `SELECT cookie_string FROM cookie_table WHERE cookie_string = '${cookie}'`);
            
            const result = await database.query(
                `SELECT cookie_string FROM cookie_table WHERE cookie_string = :cookie`,
                { 
                    replacements: { cookie }, 
                    type: database.QueryTypes.SELECT,
                    raw: true 
                }
            );
    
            console.log("Query result:", result);
            return result.length > 0 ? result[0] : null;
            
        } catch (error) {
            console.error('Error checking cookie:', error);
            throw error;
        }
    }
    
    /**
     * Deletes a cookie from the database.
     * @param {string} cookie - The cookie string to delete.
     * @returns {Promise<Object>} - Result of the delete query.
     */
    async deleteCookie(cookie) {
      /*  if(!Validation.validateCookie(cookie)) {
            return null;
        }*/
        try{
            const result = await database.query(
                `DELETE FROM cookie_table WHERE cookie_string = :cookie`,
                { 
                    replacements: { cookie }, 
                    type: database.QueryTypes.DELETE 
                }
            );
            return result;
        }catch(error){
            console.error('Error deleting cookie:', error);
            throw error;
        }
    }

    /**
     * Inserts a test dataset into the database for stress testing.
     * @param {number} n - Number of users to insert.
     * @returns {Promise<void>} - Logs the completion of insertion.
     */
    async stressTestInsert(n) {
        /*
        if(!Validation.validateID(n)) {
            return null;
        }*/
        try {
            await database.sync(); // Ensure tables exist
    
            for (let i = 1; i <= n; i++) {
                const numStr = String(i).padStart(5, '0'); // Ensures five-digit formatting for consistency
    
                const newPerson = await Person.create({
                    name: `Stress${numStr}`,
                    surname: `Test${numStr}`,
                    username: `StressTest${numStr}`,
                    email: `${numStr}@stresstest.com`,
                    pnr: `0000000${numStr}`,
                    password: `password${numStr}`,
                    role_id: 2,
                    recovery_token: null
                });
    
                await ApplicationStatus.create({
                    person_id: newPerson.person_id,
                    status: 0, // Default status
                    timeout: null, // Current timestamp
                    beinghandled: null
                });
    
                console.log(`Inserted user Stress${numStr} with ID ${newPerson.person_id}`);
            }
    
            console.log(`Successfully inserted ${n} users.`);
        } catch (error) {
            console.error("Error inserting test data:", error);
        }
    }

}



module.exports = AgentDAO;