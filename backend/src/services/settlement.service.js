import db from "../config/db.js";

export const calculateSettlement = async (groupId) => {
  // 1. Fetch summed net values
  const result = await db.query(
    `
      SELECT 
        es.user_id,
        SUM(es.net_value) AS net
      FROM expense_splits es
      JOIN expenses e ON es.expense_id = e.id
      WHERE e.group_id = $1
      GROUP BY es.user_id
    `,
    [groupId]
  );

  const balances = result.rows.map((r) => ({
    user_id: r.user_id,
    net: Number(r.net),
  }));

  // 2. Fetch user names for all involved users
  const userIds = balances.map((b) => b.user_id);

  const userRes = await db.query(
    `SELECT id, name FROM users WHERE id = ANY($1)`,
    [userIds]
  );

  const userMap = {};
  userRes.rows.forEach((u) => {
    userMap[u.id] = u.name;
  });

  // 3. Separate creditors and debtors
  const debtors = balances
    .filter((b) => b.net < 0)
    .map((b) => ({ ...b, net: Math.abs(b.net) }));

  const creditors = balances.filter((b) => b.net > 0);

  // 4. Greedy settlement
  const settlements = [];

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const amount = Math.min(debtor.net, creditor.net);

    settlements.push({
      from_user_id: debtor.user_id,
      from_name: userMap[debtor.user_id],
      to_user_id: creditor.user_id,
      to_name: userMap[creditor.user_id],
      amount,
    });

    debtor.net -= amount;
    creditor.net -= amount;

    if (debtor.net === 0) i++;
    if (creditor.net === 0) j++;
  }

  return settlements;
};
