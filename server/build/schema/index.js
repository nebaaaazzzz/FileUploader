"use strict";
// import Sequelize from 'sequelize';
// import {dbConfig} from "./../config/db.config"
// // const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
// //   host: dbConfig.HOST,
// //   dialect: dbConfig.dialect,
// //   port: dbConfig.port,
// //   operatorsAliases: false,
Object.defineProperty(exports, "__esModule", { value: true });
// //   pool: {
// //     max: dbConfig.pool.max,
// //     min: dbConfig.pool.min,
// //     acquire: dbConfig.pool.acquire,
// //     idle: dbConfig.pool.idle
// //   }
// });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize({
    dialect: "mysql",
    host: "localhost",
    database: process.env.MYSQLDB_DATABASE,
    password: "123456",
    port: Number(process.env.MYSQL_PORT),
});
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();
exports.default = sequelize;
