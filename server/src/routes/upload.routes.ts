import { Router, Request, Response } from "express";
const uploadRouter = Router();
import multer from "multer";
import sequelize from "../config/db.config";
import File from "../models/index";
import * as stream from "stream";
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1_000_000,
    fields: 0,
    files: 1,
  },
});
uploadRouter.get("/", async (req, res) => {
  console.log("\npage", req.query.page);
  let page: number = Number(req.query.page) || 1;
  let offset = 0;
  if (page > 1) {
    offset = (page - 1) * 5;
  }
  const users = await File.findAll({
    attributes: ["id", "originalFileName", "createdAt", "fileSize"],
    limit: 5,
    order: [["createdAt", "DESC"]],
    offset: offset,
  });
  res.send(users);
});
uploadRouter.get("/:id", async (req: Request, response: Response) => {
  const result = await File.findOne({
    where: {
      id: req.params.id,
    },
  });
  result?.get("buffer");
  var fileContents = Buffer.from(result?.dataValues.buffer, "base64");
  var readStream = new stream.PassThrough();
  readStream.end(fileContents);
  response
    .set(
      "Content-disposition",
      "attachment; filename=" + result?.dataValues.originalFileName
    )
    .set("Content-Type", "text/plain");

  readStream.pipe(response);
});
uploadRouter.delete("/:id", async (req: Request, response: Response) => {
  const s = await File.destroy({
    where: {
      id: req.params.id,
    },
  });
  response.send("deleted");
});
uploadRouter.post(
  "/file",
  upload.single("file"),
  async (req: Request, res: Response) => {
    const blob = new Blob(req.file?.buffer as unknown as Buffer[]);
    const file = File.build({
      originalFileName: req.file?.originalname,
      buffer: req.file?.buffer,
      fileSize: req.file?.size,
    });
    await file.save();
    res.send("hello wolrd");
  }
);
export default uploadRouter;
