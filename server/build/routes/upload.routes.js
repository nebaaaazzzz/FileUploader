"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadRouter = (0, express_1.Router)();
const multer_1 = __importDefault(require("multer"));
const index_1 = __importDefault(require("../models/index"));
const stream = __importStar(require("stream"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 1000000,
        fields: 0,
        files: 1,
    },
});
uploadRouter.get("/", async (req, res) => {
    console.log("\npage", req.query.page);
    let page = Number(req.query.page) || 1;
    let offset = 0;
    if (page > 1) {
        offset = (page - 1) * 5;
    }
    const users = await index_1.default.findAll({
        attributes: ["id", "originalFileName", "createdAt", "fileSize"],
        limit: 5,
        order: [["createdAt", "DESC"]],
        offset: offset,
    });
    res.send(users);
});
uploadRouter.get("/:id", async (req, response) => {
    const result = await index_1.default.findOne({
        where: {
            id: req.params.id,
        },
    });
    result === null || result === void 0 ? void 0 : result.get("buffer");
    var fileContents = Buffer.from(result === null || result === void 0 ? void 0 : result.dataValues.buffer, "base64");
    var readStream = new stream.PassThrough();
    readStream.end(fileContents);
    response
        .set("Content-disposition", "attachment; filename=" + (result === null || result === void 0 ? void 0 : result.dataValues.originalFileName))
        .set("Content-Type", "text/plain");
    readStream.pipe(response);
});
uploadRouter.delete("/:id", async (req, response) => {
    const s = await index_1.default.destroy({
        where: {
            id: req.params.id,
        },
    });
    response.send("deleted");
});
uploadRouter.post("/file", upload.single("file"), async (req, res) => {
    var _a, _b, _c, _d;
    const blob = new Blob((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer);
    const file = index_1.default.build({
        originalFileName: (_b = req.file) === null || _b === void 0 ? void 0 : _b.originalname,
        buffer: (_c = req.file) === null || _c === void 0 ? void 0 : _c.buffer,
        fileSize: (_d = req.file) === null || _d === void 0 ? void 0 : _d.size,
    });
    await file.save();
    res.send("hello wolrd");
});
exports.default = uploadRouter;
