import pool from '../config/db.js';

export const createSettlement = async (groupId, fromUserId, toUserId, amount) => {
  const result = await pool.query(
    `INSERT INTO settlements (group_id, from_user_id, to_user_id, amount, settled_at)
     VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
    [groupId, fromUserId, toUserId, amount]
  );
  return result.rows[0];
};

export const getSettlementsByGroup = async (groupId) => {
  const result = await pool.query(
    `SELECT * FROM settlements WHERE group_id = $1`,
    [groupId]
  );
  return result.rows;
};
