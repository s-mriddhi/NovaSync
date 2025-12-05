import { calculateSettlement } from "../services/settlement.service.js";

export const getGroupSettlement = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;

    const settlements = await calculateSettlement(groupId);

    return res.status(200).json({
      success: true,
      groupId,
      settlements,
    });
  } catch (error) {
    next(error);
  }
};
