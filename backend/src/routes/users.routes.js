import express from "express";
import { getUserId } from "../controllers/users.controller.js";

const router = express.Router();

router.get("/", getUserId);

export default router;
