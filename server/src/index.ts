import express, { Request, Response } from "express";
import uploadRouter from "./routes/upload.routes";
import * as dotenv from "dotenv";
import sequelize from "./config/db.config";
import cors from "cors";

dotenv.config();

const PORT = process.env.NODE_DOCKER_PORT;
const app = express();
async () => {
  await sequelize.sync({ force: true });
  sequelize.authenticate();
};
app.use(cors());
app.use("/", uploadRouter);
app.listen(PORT, () => {
  console.log("server running on " + PORT);
});
// app.use((error, req: Request, res: Response) => {});
