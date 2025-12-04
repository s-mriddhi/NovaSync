import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER USER
export const registerUserService = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw { status: 400, message: "User already exists" };
  }

  const result = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id, name, email",
    [name, email, hashedPassword]
  );

  return result.rows[0];
};

// LOGIN USER
export const loginUserService = async ({ email, password }) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");

  const userQuery = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (userQuery.rows.length === 0) {
    throw { status: 400, message: "Invalid credentials" };
  }

  const user = userQuery.rows[0];

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw { status: 400, message: "Invalid credentials" };

  // Generate JWT here, where 'user' exists
  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};
