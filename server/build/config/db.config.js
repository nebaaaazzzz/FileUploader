"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize({
    database: "fileupload",
    password: "",
    username: "root",
    dialect: "mysql",
    omitNull: true,
});
exports.default = sequelize;
