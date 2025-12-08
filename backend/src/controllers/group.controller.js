import { createNewGroup, getGroupWithMembers } from '../services/group.service.js';
import { fetchUserGroups } from "../services/group.service.js";

export const getGroupsByUserEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const groups = await fetchUserGroups(email);

    return res.json({
      email,
      groups,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createGroupController = async (req, res, next) => {
  try {
    const { groupName, groupDescription, memberIds } = req.body;
    const createdBy = req.user.id; // from auth middleware

    const group = await createNewGroup(groupName, groupDescription, createdBy, memberIds);
    res.status(201).json(group);
  } catch (err) {
    next(err); // passes to errorHandler middleware
  }
};

export const getGroupController = async (req, res, next) => {
  try {
    const groupId = req.params.id;
    const group = await getGroupWithMembers(groupId);
    res.json(group);
  } catch (err) {
    next(err);
  }
};
