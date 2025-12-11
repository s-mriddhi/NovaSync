//expense.model.js
import pool from '../config/db.js';

export const createExpense = async (groupId, paidBy, description, amount, expenseDate) => {
  const result = await pool.query(
    `INSERT INTO expenses (group_id, paid_by, description, amount, expense_date) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [groupId, paidBy, description, amount, expenseDate]
  );
  return result.rows[0];
};

export const getExpensesByGroup = async (groupId) => {
  const result = await pool.query(
    `SELECT e.*,
            payer.name AS paid_by_name,
            COALESCE(
              json_agg(
                json_build_object(
                  'user_id', es.user_id,
                  'name', u.name,
                  'split_type', es.split_type,
                  'value', es.value,
                  'owed_amount', es.owed_amount
                )
              ) FILTER (WHERE es.id IS NOT NULL),
              '[]'
            ) AS splits
     FROM expenses e
     LEFT JOIN users payer ON payer.id = e.paid_by
     LEFT JOIN expense_splits es ON es.expense_id = e.id
     LEFT JOIN users u ON u.id = es.user_id
     WHERE e.group_id = $1
     GROUP BY e.id, payer.name
     ORDER BY e.expense_date DESC`,
    [groupId]
  );

  return result.rows;
};
