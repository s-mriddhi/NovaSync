import React from "react";  
import styles from "./GroupSummary.module.css";
import piggy from "../../../assets/moneyPool.png";
const GroupSummary = ({ group }) => {
  // ---- LOGIC: calculate total spent ----
  const totalSpent = group?.expenses?.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  return (
    <div className={styles.groupSummary}>
      {/* Group Image */}
      <img
        src={piggy}
        className={styles.groupImage}
      />

      {/* Total Amount */}
      <div className={styles.totalAmount}>
        ₹ {totalSpent.toLocaleString()}
      </div>

      {/* Subtext */}
      <div className={styles.subText}>
        {totalSpent > 0 ? "Expense Pool" : "No expenses yet"}
      </div>
    </div>
  );
};

export default GroupSummary;
