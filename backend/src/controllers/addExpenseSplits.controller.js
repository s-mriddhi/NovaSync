// controllers/expenses/addExpenseSplits.controller.js
import * as ExpenseSplitModel from "../models/expenseSplit.model.js";

export const addExpenseSplits = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { splits } = req.body;

    if (!splits || !Array.isArray(splits)) {
      return res.status(400).json({ error: "Splits array is required" });
    }

    const savedSplits = [];

    for (const s of splits) {
      const row = await ExpenseSplitModel.createExpenseSplit(
        expenseId,
        s.user_id,
        s.split_type,
        s.value
      );
      savedSplits.push(row);
    }

    return res.status(201).json({
      message: "Splits added successfully",
      splits: savedSplits,
    });
  } catch (err) {
    console.error("Error adding splits:", err);
    return res.status(500).json({ error: "Failed to add splits" });
  }
};
