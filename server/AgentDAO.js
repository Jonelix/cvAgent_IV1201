const { Sequelize, DataTypes } = require('sequelize');

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
    name: { type: DataTypes.STRING, allowNull: false },
    surname: { type: DataTypes.STRING, allowNull: false },
    pnr: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role_id: { type: DataTypes.INTEGER, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true }
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
}

module.exports = AgentDAO;