import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  database: "fileupload",
  password: "",
  username: "root",
  dialect: "mysql",
  omitNull: true,
});
export default sequelize;
