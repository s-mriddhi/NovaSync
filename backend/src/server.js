import dotenv from "dotenv";
dotenv.config(); // MUST be FIRST

import express from "express";
import cors from "cors";

// DB and Routes imports
import "./config/db.js"; 
import helloRoutes from "./routes/hello.routes.js";
import authRoutes from "./routes/auth.routes.js";
import groupRoutes from "./routes/groups.routes.js";
import expenseRoutes from "./routes/expenses.routes.js";
import settlementRoutes from "./routes/settlement.routes.js";

console.log("JWT_SECRET =", process.env.JWT_SECRET); // check it's loaded

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/hello", helloRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api", settlementRoutes);
//all the above routes are connected atleast.

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
