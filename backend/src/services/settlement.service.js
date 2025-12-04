// services/settlement.services.js
import { getExpensesByGroup } from "../models/expense.model.js";

/**
 * Greedy settlement algorithm
 * Input: groupId
 * Output: array of transactions { from, to, amount }
 */
export const calculateSettlement = async (groupId) => {
  const expenses = await getExpensesByGroup(groupId);

  // 1. Build net balances for each user
  const balances = {}; // { userId: balance }

  for (const expense of expenses) {
    const paidBy = expense.paid_by;
    const amount = expense.amount;

    balances[paidBy] = (balances[paidBy] || 0) + amount;

    for (const split of expense.splits) {
      balances[split.user_id] = (balances[split.user_id] || 0) - split.owed_amount;
    }
  }

  // 2. Separate creditors and debtors
  const creditors = [];
  const debtors = [];

  for (const [userId, balance] of Object.entries(balances)) {
    const amt = Number(balance.toFixed(2));
    if (amt > 0) creditors.push({ userId, amount: amt });
    else if (amt < 0) debtors.push({ userId, amount: -amt });
  }

  // 3. Greedy matching
  const transactions = [];
  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const settledAmount = Math.min(debtor.amount, creditor.amount);

    transactions.push({
      from: debtor.userId,
      to: creditor.userId,
      amount: settledAmount
    });

    debtor.amount -= settledAmount;
    creditor.amount -= settledAmount;

    if (debtor.amount === 0) i++;
    if (creditor.amount === 0) j++;
  }

  return transactions;
};
