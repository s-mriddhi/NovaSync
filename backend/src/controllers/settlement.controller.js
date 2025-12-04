// controllers/settlement.controller.js
import { calculateSettlement } from "../services/settlement.service.js";

export const getSettlement = async (req, res) => {
  try {
    const { groupId } = req.params;

    const transactions = await calculateSettlement(groupId);

    return res.json({
      groupId,
      transactions
    });
  } catch (err) {
    console.error("Error calculating settlement:", err);
    return res.status(500).json({ error: "Failed to calculate settlement" });
  }
};
