import express from "express";
import { createUser } from "../controllers/userController";

const router = express.Router();

// POST /api/users
router.post("/", createUser);

export default router;
