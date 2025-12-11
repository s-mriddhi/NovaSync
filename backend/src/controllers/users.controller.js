import { getUserIdByName } from "../models/user.model.js";

export const getUserId = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: "username is required" });
    }

    const user = await getUserIdByName(username);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ userId: user.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
