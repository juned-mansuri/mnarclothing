import express from "express";
import { addGlimpse, listGlimpses, deleteGlimpse } from "../controllers/glimpseController.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js"; // Reuse your existing multer configuration

const router = express.Router();

// Routes
router.post("/add", adminAuth, upload.single("image"), addGlimpse);
router.get("/list", listGlimpses);
router.post("/delete", adminAuth, deleteGlimpse);

export default router;