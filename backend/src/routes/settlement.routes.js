import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { getSettlement } from "../controllers/settlement.controller.js";

const router = express.Router();

// Working check route
router.get("/check", (req, res) => {
  res.json({ message: "Settlement routes are working!" });
});

// Get settlement transactions for a group
router.get("/groups/:groupId/settlement", auth, getSettlement);

export default router;
