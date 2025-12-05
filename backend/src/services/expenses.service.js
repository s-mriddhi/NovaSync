// expense.services.js
import { createExpense } from '../models/expense.model.js';
import { createExpenseSplit } from '../models/expenseSplit.model.js';

/**
 * MAIN SERVICE: create an expense + calculate owed amounts + store splits
 */
export const createExpenseWithSplits = async (payload) => {
  const {
    groupId,
    paidBy,
    description,
    amount,
    expenseDate,
    splitType,      // "equal" | "exact" | "percentage"
    participants    // array of: { userId, value }
  } = payload;

  // 1. Create the expense row
  const expense = await createExpense(
    groupId,
    paidBy,
    description,
    amount,
    expenseDate
  );

  const expenseId = expense.id;

  // 2. Generate owed amounts based on split type
  const splits = calculateSplits(amount, splitType, participants);

  // 3. Store all splits in DB
  for (const s of splits) {
    const netValue =
      s.userId === paidBy
        ? Number((amount - s.owedAmount).toFixed(2))   // payer gets +balance
        : Number((-s.owedAmount).toFixed(2));          // others get negative

    await createExpenseSplit(
      expenseId,
      s.userId,
      s.owedAmount,
      netValue,
      splitType,
      s.value
    );
  }

  return {
    expense,
    splits
  };
};

/**
 * BUSINESS LOGIC — calculate owed amounts
 */
export const calculateSplits = (amount, splitType, participants) => {
  let results = [];

  switch (splitType) {

    case "equal":
      const perPerson = amount / participants.length;
      results = participants.map(p => ({
        userId: p.userId,
        value: null,
        owedAmount: Number(perPerson.toFixed(2))
      }));
      break;

    case "exact":
      // p.value = how much user owes directly
      const totalExact = participants.reduce((sum, p) => sum + Number(p.value), 0);
      if (totalExact !== amount)
        throw new Error("Exact split values must add up to total amount.");

      results = participants.map(p => ({
        userId: p.userId,
        value: p.value,
        owedAmount: Number(p.value)
      }));
      break;

    case "percentage":
      const totalPercent = participants.reduce((sum, p) => sum + Number(p.value), 0);
      if (totalPercent !== 100)
        throw new Error("Percentage split must total 100.");

      results = participants.map(p => ({
        userId: p.userId,
        value: p.value,
        owedAmount: Number(((p.value / 100) * amount).toFixed(2))
      }));
      break;

    default:
      throw new Error("Invalid split type.");
  }

  return results;
};
