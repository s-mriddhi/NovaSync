import pool from '../config/db.js';

export const getUserGroups = async (email) => {
  const result = await pool.query(
    `
      SELECT g.id, g.group_name
      FROM groups g
      JOIN group_members gm ON g.id = gm.group_id
      JOIN users u ON gm.user_id = u.id
      WHERE u.email = $1
    `,
    [email]
  );

  return result.rows; 
};

export const createGroup = async (groupName, groupDescription, createdBy) => {
  const result = await pool.query(
    `INSERT INTO groups (group_name, group_description, created_by) 
     VALUES ($1, $2, $3) RETURNING *`,
    [groupName, groupDescription, createdBy]
  );
  return result.rows[0];
};

export const getGroupById = async (id) => {
  const result = await pool.query(`SELECT * FROM groups WHERE id = $1`, [id]);
  return result.rows[0];
};