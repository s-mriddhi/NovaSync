import pool from '../config/db.js';

export const createActivityLog = async (groupId, userId, actionType, details) => {
  const result = await pool.query(
    `INSERT INTO activity_logs (group_id, user_id, action_type, details, created_at)
     VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
    [groupId, userId, actionType, JSON.stringify(details)]
  );
  return result.rows[0];
};

export const getActivityLogsByGroup = async (groupId) => {
  const result = await pool.query(
    `SELECT * FROM activity_logs WHERE group_id = $1 ORDER BY created_at DESC`,
    [groupId]
  );
  return result.rows;
};

