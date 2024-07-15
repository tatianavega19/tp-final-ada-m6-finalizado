import { Sequelize, DataTypes, Model } from 'sequelize';
import { URL } from "../../constants";

const sequelize = new Sequelize(URL, {
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

async function testConnection() {
    try {
        return await sequelize.authenticate();
    } catch (error) {
        return new Error('Cannot establish connection to the server');
    }
}

export { testConnection, DataTypes, Model };
export default sequelize;