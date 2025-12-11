import { createExpense } from '../models/expense.model.js';
import { createExpenseSplit } from '../models/expenseSplit.model.js';
import { getGroupMembers } from '../models/groupMember.model.js';
import pool from '../config/db.js';

/**
 * MAIN SERVICE: create an expense + calculate shares + store splits
 */
export const createExpenseWithSplits = async (payload) => {
  const { groupId, paidBy, description, amount, expenseDate, splitType, participants } = payload;

  // 1️⃣ Create expense row
  const expense = await createExpense(groupId, paidBy, description, amount, expenseDate);
  const expenseId = expense.id;

  // 2️⃣ Determine participants
  let finalParticipants = participants;

  if (!participants || participants.length === 0) {
    const members = await getGroupMembers(groupId);
    finalParticipants = members.map(m => ({ userId: m.user_id, value: null }));
  }

  // 3️⃣ Calculate splits
  const splits = calculateSplits(amount, splitType, finalParticipants);

  // 4️⃣ Store splits + net_value
  const storedSplits = [];
  for (const s of splits) {
    const netValue = s.userId === paidBy
      ? Number((amount - s.expense_share).toFixed(2))
      : Number((-s.expense_share).toFixed(2));

    const splitRow = await createExpenseSplit(
      expenseId,
      s.userId,
      s.expense_share,
      netValue,
      splitType,
      s.value
    );

    storedSplits.push(splitRow);
  }

  // 5️⃣ Fetch user names for splits
  const userIds = storedSplits.map(s => s.user_id);
  const { rows: users } = await pool.query(
    `SELECT id, name FROM users WHERE id = ANY($1)`,
    [userIds]
  );

  // Map id → name
  const userMap = {};
  users.forEach(u => (userMap[u.id] = u.name));

  // Attach name to splits
  const splitsWithNames = storedSplits.map(s => ({
    ...s,
    name: userMap[s.user_id] || `User ${s.user_id}`
  }));

  return {
    message: "Expense created successfully",
    expense,
    splits: splitsWithNames
  };
};


export const calculateSplits = (amount, splitType, participants) => {
  let results = [];

  switch (splitType) {

    case "equal":
      const perPerson = amount / participants.length;
      results = participants.map(p => ({
        userId: p.userId,
        value: null,
        expense_share: Number(perPerson.toFixed(2))
      }));
      break;

    case "exact":
      const exactTotal = participants.reduce((sum, p) => sum + Number(p.value), 0);
      if (exactTotal !== amount)
        throw new Error("Exact split values must match total amount.");

      results = participants.map(p => ({
        userId: p.userId,
        value: p.value,
        expense_share: Number(p.value)
      }));
      break;

    case "percentage":
      const percentTotal = participants.reduce((sum, p) => sum + Number(p.value), 0);
      if (percentTotal !== 100)
        throw new Error("Percentage values must total 100.");

      results = participants.map(p => ({
        userId: p.userId,
        value: p.value,
        expense_share: Number(((p.value / 100) * amount).toFixed(2))
      }));
      break;

    default:
      throw new Error("Invalid split type.");
  }

  return results;
};