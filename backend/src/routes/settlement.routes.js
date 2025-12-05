import express from "express";
import { getGroupSettlement } from "../controllers/settlement.controller.js";

const router = express.Router();

router.get("/check", (req, res) => {
  res.json({ message: "Auth routes are working!" });
});

router.get("/:groupId", getGroupSettlement);

export default router;
