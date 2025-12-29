import React from "react";
import styles from "../GroupPage.module.css";

export default function ExpensesSection({ expenses, group, showAddExpenseModal, setShowAddExpenseModal }) {
  return (
    <section id="expenses-section" className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Expenses</h2>
        <button className={styles.addButton} onClick={() => setShowAddExpenseModal(true)}>+</button>
      </div>

      {expenses.length === 0 ? (
        <p>No expenses recorded.</p>
      ) : (
        <div className={styles.expenseList}>
          {expenses.map((e) => {
            const payerName = group.members.find((m) => m.id === e.paid_by)?.name || `User ${e.paid_by}`;
            return (
              <div key={e.id} className={styles.expenseCard}>
                <div className={styles.expenseHeader}>
                  <h3 className={styles.expenseTitle}>{e.description}</h3>
                  <span className={styles.expenseAmount}>₹{Number(e.amount)}</span>
                </div>
                Paid by <strong>{e.paid_by_name}</strong> on {new Date(e.expense_date).toLocaleDateString()}
                <div className={styles.splitContainer}>
                  {e.splits.map((s, i) => {
                    const isPercentage = s.split_type === "percentage";
                    return (
                      <div key={i} className={styles.splitRow}>
                        <span className={styles.splitUser}>{s.name}</span>
                        <span className={styles.splitType}>({isPercentage ? "Percentage" : "Exact"})</span>
                        {isPercentage && <span className={styles.splitPercent}>({s.value}%)</span>}
                        <span className={styles.splitShare}>Expense share: ₹{Number(s.owed_amount)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
