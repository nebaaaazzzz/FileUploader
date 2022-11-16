"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
const File = db_config_1.default.define("files", {
    // Model attributes are defined here
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    originalFileName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    fileSize: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    // fileName: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    buffer: {
        type: sequelize_1.DataTypes.BLOB("medium"),
        allowNull: false,
        // allowNull defaults to true
    },
}, {
    timestamps: true,
    // Other model options go here
});
exports.default = File;
