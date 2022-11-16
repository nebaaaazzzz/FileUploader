import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/db.config";

const File = sequelize.define(
  "files",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    originalFileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // fileName: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    buffer: {
      type: DataTypes.BLOB("medium"),
      allowNull: false,
      // allowNull defaults to true
    },
  },
  {
    timestamps: true,
    // Other model options go here
  }
);

export default File;
