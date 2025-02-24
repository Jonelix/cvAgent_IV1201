const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

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
    username: { type: DataTypes.STRING, allowNull: true, unique: true }
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

(async () => {
    await database.sync({ force: false }); // Adjust as needed
})();

class AgentDAO {
    async findUserWithUsername(username) {
        return await Person.findOne({ where: { username } });
    }

    async registerUser(firstName, lastName, personNumber, username, email, password, role_id) {
        //const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
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

    async getCompetencies() {
        const competencies = await database.query('SELECT * FROM competence', { type: database.QueryTypes.SELECT });
        return competencies;
        
    }

    /*
    async getApplicantProfile() {
        const applicant = await database.query(
    `  SELECT cp.*, 
        p.name AS person_name, 
        p.surname, 
        c.name AS competence_name 
    FROM competence_profile cp
        JOIN person p ON cp.person_id = p.person_id
        JOIN competence c ON cp.competence_id = c.competence_id
        LIMIT 40;

    `, { type: database.QueryTypes.SELECT });   
    return applicant;
    }
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

    async getApplicantProfile(personId) {
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
    
    async handleApplicantStatus(rec_id, app_id) {
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
    
    
    
    

    async confirmStatusUpdate(rec_id, app_id, status) {
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

    async fetchPerson(firstName, lastName) {
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
    
    async getUserCompetencies(person_id) {
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

    async getUserAvailability(person_id) {
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

    async fetchCompetenceId(competence) {
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

    async createApplication(person_id, competencies, availabilityList) {
    const transaction = await database.transaction();

    try {
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
                    return { 
                        message: 'One of the availabilities you entered already exists in our database. Please check for duplicates.',  
                        conflictAvailability: {
                            from_date: availability.from_date,
                            to_date: availability.to_date
                        }
                    };            
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
        
        await transaction.commit();
        return { message: 'Application successfully processed!' };
    } catch (error) {
        await transaction.rollback();
        console.error('Error creating application:', error);
        throw error;
    }
}

        
        
    async deleteCompetence(person_id) {
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

    async deleteAvailability(person_id) {
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
}

module.exports = AgentDAO;