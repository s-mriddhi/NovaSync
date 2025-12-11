import pool from '../config/db.js';

export const createUser = async (name, email, phone, passwordHash) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, phone, password_hash) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, email, phone, passwordHash]
  );
  return result.rows[0];
};

export const getUserById = async (id) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result.rows[0];
};

export const getUserIdByName = async (name) => {
  const result = await pool.query(
    `SELECT id FROM users WHERE name = $1`,
    [name]
  );
  return result.rows[0];  // might return { id: 3 }
};