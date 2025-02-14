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
        console.log("Creating user in db...")
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
    
    
    
    
    
    

}

module.exports = AgentDAO;