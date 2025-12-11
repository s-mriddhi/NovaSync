//expenseSplit.model.js
import pool from '../config/db.js';


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
