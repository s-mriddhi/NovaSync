import pool from '../config/db.js';

export const addMemberToGroup = async (groupId, userId) => {
  const result = await pool.query(
    `INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) RETURNING *`,
    [groupId, userId]
  );
  return result.rows[0];
};

export const getGroupMembers = async (groupId) => {
  const result = await pool.query(
    `SELECT * FROM group_members WHERE group_id = $1`,
    [groupId]
  );
  return result.rows;
};
