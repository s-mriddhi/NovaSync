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
    `
    SELECT gm.id, gm.group_id, gm.user_id, gm.joined_at, u.name, u.email
    FROM group_members gm
    JOIN users u ON gm.user_id = u.id
    WHERE gm.group_id = $1
    `,
    [groupId]
  );
  return result.rows;
};
