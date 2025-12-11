//UNUSED MODEL
import pool from '../config/db.js';

export const updateBalance = async (groupId, fromUserId, toUserId, balanceAmount) => {
  const result = await pool.query(
    `INSERT INTO balances (group_id, from_user_id, to_user_id, balance_amount, updated_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (group_id, from_user_id, to_user_id) 
     DO UPDATE SET balance_amount = EXCLUDED.balance_amount, updated_at = NOW()
     RETURNING *`,
    [groupId, fromUserId, toUserId, balanceAmount]
  );
  return result.rows[0];
};

export const getBalancesByGroup = async (groupId) => {
  const result = await pool.query(
    `SELECT * FROM balances WHERE group_id = $1`,
    [groupId]
  );
  return result.rows;
};

//on conflict requires UNIQUE constraint on (group_id, from_user_id, to_user_id)