import pool from '../config/db.js';

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