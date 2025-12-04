import { createGroup, getGroupById } from '../models/group.model.js';
import { addMemberToGroup, getGroupMembers } from '../models/groupMember.model.js';

export const createNewGroup = async (groupName, groupDescription, createdBy, memberIds = []) => {
  // 1. Create the group
  const group = await createGroup(groupName, groupDescription, createdBy);

  // 2. Add members (including creator)
  const allMembers = Array.from(new Set([createdBy, ...memberIds])); // avoid duplicates
  for (const userId of allMembers) {
    await addMemberToGroup(group.id, userId);
  }

  // 3. Return group with members
  const members = await getGroupMembers(group.id);
  return { ...group, members };
};

export const getGroupWithMembers = async (groupId) => {
  const group = await getGroupById(groupId);
  if (!group) throw new Error('Group not found');

  const members = await getGroupMembers(groupId);
  return { ...group, members };
};
