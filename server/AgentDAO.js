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
    
    async getApplicantProfile() {
        const applicant = await database.query(
        `
        SELECT 
            p.person_id, 
            p.name AS person_name, 
            p.surname, 
        JSON_AGG(
            JSON_BUILD_OBJECT(
            'competence_name', c.name, 
            'years_of_experience', cp.years_of_experience
            )
        ) AS competencies,
        
        avail.from_date,
        avail.to_date
        FROM competence_profile cp

        JOIN person p ON cp.person_id = p.person_id
        JOIN competence c ON cp.competence_id = c.competence_id
    LEFT JOIN (
    SELECT 
        person_id,
        MIN(from_date) AS from_date,
        MAX(to_date) AS to_date
    FROM availability
    GROUP BY person_id
    ) avail ON p.person_id = avail.person_id
    GROUP BY p.person_id, p.name, p.surname, avail.from_date, avail.to_date; `
    ,  
            { type: database.QueryTypes.SELECT }
        );   
        return applicant;
    }
    
    

}

module.exports = AgentDAO;