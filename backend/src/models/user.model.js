import pool from '../config/db.js';

// Create new user
export const createUser = async (name, email, phone, passwordHash) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, phone, password_hash) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, email, phone, passwordHash]
  );
  return result.rows[0];
};

// Get full user by ID
export const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT id, name, email, phone FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

// Lookup user by username
export const getUserIdByName = async (name) => {
  const result = await pool.query(
    `SELECT id, name, email 
     FROM users 
     WHERE name = $1 
     LIMIT 1`,
    [name]
  );
  return result.rows[0];
};

// Lookup user by email
export const getUserIdByEmail = async (email) => {
  const result = await pool.query(
    `SELECT id, name, email 
     FROM users 
     WHERE email = $1 
     LIMIT 1`,
    [email]
  );
  return result.rows[0];
};
