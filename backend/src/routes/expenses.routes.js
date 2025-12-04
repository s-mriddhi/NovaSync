import express from "express";
import { auth } from "../middlewares/auth.middleware.js";

import { createExpense } from "../controllers/createExpense.controller.js";
import { addExpenseSplits } from "../controllers/addExpenseSplits.controller.js";
import * as ExpenseModel from "../models/expense.model.js";

const router = express.Router();

// Test
router.get("/check", (req, res) => {
  res.json({ message: "Expense routes are working!" });
});

// Create expense + splits (service integrated)
router.post("/groups/:groupId/expenses", auth, createExpense);

// Optional: Manual splits route (kept untouched)
router.post("/expenses/:expenseId/splits", auth, addExpenseSplits);

// Get all expenses with splits
router.get("/groups/:groupId/expenses", auth, async (req, res) => {
  try {
    const expenses = await ExpenseModel.getExpensesByGroup(req.params.groupId);
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

export default router;
