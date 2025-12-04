//expenseSplit.model.js
import pool from '../config/db.js';

export const createExpenseSplit = async (expenseId, userId, owed_Amount, splitType, value) => {
  const result = await pool.query(
    `INSERT INTO expense_splits (expense_id, user_id, owed_amount, split_type, value)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [expenseId, userId, 0, splitType, value]
  );
  return result.rows[0];
};

export const getExpenseSplits = async (expenseId) => {
  const result = await pool.query(
    `SELECT * FROM expense_splits WHERE expense_id = $1`,
    [expenseId]
  );
  return result.rows;
};

