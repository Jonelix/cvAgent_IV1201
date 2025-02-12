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
        return await Competence.findAll();
    }
}

module.exports = AgentDAO;