import { createNewGroup, getGroupWithMembers } from '../services/group.service.js';

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
