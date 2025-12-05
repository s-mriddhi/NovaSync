//expenseSplit.model.js
import pool from '../config/db.js';

/* 
NET VALUE COLUMN KE PEHLE WALA CODE (CLEAN LATER IF NOT NEEDED):
export const createExpenseSplit = async (expenseId, userId, owedAmount, splitType, value) => {
  const result = await pool.query(
    `INSERT INTO expense_splits (expense_id, user_id, owed_amount, split_type, value)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [expenseId, userId, owedAmount, splitType, value]
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
*/
export const createExpenseSplit = async (
  expenseId,
  userId,
  owedAmount,
  netValue,
  splitType,
  value
) => {
  const result = await pool.query(
    `INSERT INTO expense_splits 
       (expense_id, user_id, owed_amount, net_value, split_type, value)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [expenseId, userId, owedAmount, netValue, splitType, value]
  );

  return result.rows[0];
};
