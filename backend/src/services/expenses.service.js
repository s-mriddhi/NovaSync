// expense.services.js
import { createExpense } from '../models/expense.model.js';
import { createExpenseSplit } from '../models/expenseSplit.model.js';
import { getGroupMembers } from '../models/groupMember.model.js';

/**
 * MAIN SERVICE: create an expense + calculate shares + store splits
 */
export const createExpenseWithSplits = async (payload) => {
  const {
    groupId,
    paidBy,
    description,
    amount,
    expenseDate,
    splitType,
    participants
  } = payload;

  // 1. Create expense row
  const expense = await createExpense(
    groupId,
    paidBy,
    description,
    amount,
    expenseDate
  );

  const expenseId = expense.id;

  // 2A. If participants array empty → load group members
  let finalParticipants = participants;

  if (!participants || participants.length === 0) {
    const members = await getGroupMembers(groupId);

    finalParticipants = members.map(m => ({
      userId: m.user_id,   // your DB column
      value: null
    }));
  }

  // 2B. Calculate shares
  const splits = calculateSplits(amount, splitType, finalParticipants);

  // 3. Store splits + net_value
  for (const s of splits) {
    const netValue =
      s.userId === paidBy
        ? Number((amount - s.expense_share).toFixed(2))
        : Number((-s.expense_share).toFixed(2));

    await createExpenseSplit(
      expenseId,
      s.userId,
      s.expense_share,
      netValue,
      splitType,
      s.value
    );
  }

  return {
    message: "Expense created successfully",
    expense,
    splits
  };
};

/**
 * LOGIC: calculate expense_share for users
 */
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
