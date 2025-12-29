import React from "react";  
import styles from "./GroupSummary.module.css";
import piggy from "../../../assets/moneyPool.png";
const GroupSummary = ({ group }) => {
  // ---- LOGIC: calculate total spent ----
  const totalSpent = group?.expenses?.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );
  const totalMembers = group?.members?.length || 0;

  // ---- TOTAL EXPENSES ----
  const totalExpenses = group?.expenses?.length || 0;


  return (
   <div className={styles.groupSummary}>
  <div className={styles.summaryRow}>
    
    {/* LEFT SIDE */}
    <div className={styles.leftBlock}>
      <img
        src={piggy}
        alt="Expense Pool"
        className={styles.groupImage}
      />

      <div className={styles.amountBlock}>
        <div className={styles.totalAmount}>
          ₹ {totalSpent.toLocaleString()}
        </div>
        <div className={styles.subText}>
          {totalSpent > 0 ? "Expense Pool" : "No expenses yet"}
        </div>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className={styles.rightBlock}>
      <div className={styles.statItem}>
        <span className={styles.statValue}>{totalMembers}</span>
        <span className={styles.statLabel}>Group Members</span>
      </div>

      <div className={styles.statItem}>
        <span className={styles.statValue}>{totalExpenses}</span>
        <span className={styles.statLabel}>Added Expenses</span>
      </div>
    </div>

  </div>
</div>



  );
};

export default GroupSummary;