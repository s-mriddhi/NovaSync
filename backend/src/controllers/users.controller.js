import { getUserIdByName, getUserIdByEmail } from "../models/user.model.js";

export const getUserId = async (req, res) => {
  try {
    const { username, email } = req.query;

    if (!username && !email) {
      return res.status(400).json({ error: "username or email is required" });
    }

    let user = null;

    if (username) {
      user = await getUserIdByName(username);
    } else if (email) {
      user = await getUserIdByEmail(email);
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ userId: user.id, name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
