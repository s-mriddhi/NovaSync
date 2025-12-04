// controllers/expenses/createExpense.controller.js
import { createExpenseWithSplits } from "../services/expenses.service.js ";

export const createExpense = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { description, amount, expenseDate, splitType, participants } = req.body;

    const paidBy = req.user.id;

    const result = await createExpenseWithSplits({
      groupId,
      paidBy,
      description,
      amount,
      expenseDate,
      splitType,
      participants
    });

    return res.status(201).json({
      message: "Expense created successfully",
      expense: result.expense,
      splits: result.splits
    });

  } catch (err) {
    console.error("Error creating expense:", err);
    return res.status(500).json({ error: err.message || "Failed to create expense" });
  }
};
