import express from "express";
import multer from "multer";
import { uploadFile } from "../controllers/upload.controller.js";

const router = express.Router();

// store files in memory buffer (not disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("file"), uploadFile);

export default router;
