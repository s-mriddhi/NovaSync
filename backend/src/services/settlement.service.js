import db from "../config/db.js"; // your pgPool or pgClient

export const calculateSettlement = async (groupId) => {
  // 1. Fetch summed net values for all users of the requested group
  const result = await db.query(
    `
      SELECT 
        user_id,
        SUM(net_value) AS net
      FROM expense_splits es
      JOIN expenses e ON es.expense_id = e.id
      WHERE e.group_id = $1
      GROUP BY user_id
    `,
    [groupId]
  );

  const balances = result.rows.map((r) => ({
    user_id: r.user_id,
    net: Number(r.net),
  }));

  // 2. Split into payers (negative) and receivers (positive)
  const debtors = balances
    .filter((b) => b.net < 0)
    .map((b) => ({ ...b, net: Math.abs(b.net) })); // positive amounts for algo

  const creditors = balances.filter((b) => b.net > 0);

  // 3. Greedy settlement
  const settlements = [];

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const amount = Math.min(debtor.net, creditor.net);

    settlements.push({
      from: debtor.user_id,
      to: creditor.user_id,
      amount,
    });

    debtor.net -= amount;
    creditor.net -= amount;

    if (debtor.net === 0) i++;
    if (creditor.net === 0) j++;
  }

  return settlements;
};
