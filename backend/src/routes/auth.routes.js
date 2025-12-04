import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { validate, registerSchema, loginSchema } from "../middlewares/validate.middleware.js";
import { auth } from "../middlewares/auth.middleware.js";
import { rateLimit } from "../middlewares/rateLimit.middleware.js";
import { errorHandler } from "../middlewares/errorHandler.middleware.js";

const router = express.Router();

// Working check route
router.get("/check", (req, res) => {
  res.json({ message: "Auth routes are working!" });
});

//Register route
router.post("/register", rateLimit, validate(registerSchema), registerUser);

// Login route
router.post("/login", validate(loginSchema), loginUser);

// Example protected route
router.get("/profile", auth, (req, res) => {
  res.json({ message: "Protected route", user: req.user });
});

// Error handler at the end
router.use(errorHandler);

export default router;