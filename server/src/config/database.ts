import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

let sequelize: Sequelize;

// Support both DATABASE_URL (for Vercel/cloud) and individual env vars (for local dev)
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      idle: 30000,
      acquire: 60000,
    },
    dialectOptions: {
      connectTimeout: 10000,
    },
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'companyvoice',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'password',
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      dialect: 'mysql',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 10,
        min: 0,
        idle: 10000,
      },
    }
  );
}

export default sequelize;
