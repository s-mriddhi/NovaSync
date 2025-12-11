import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import styles from "./GroupPage.module.css";
import SectionNav from "../../Components/SectionNav";
import AddExpenseModal from "../../Components/AddExpenseModal";

export default function GroupPage() {
  const { groupId } = useParams();
  const token = localStorage.getItem("token");

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showSettlements, setShowSettlements] = useState(false);
  
  // ---------------- Fetch Group, Expenses & Settlements ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch group
        const groupRes = await axios.get(`http://localhost:4000/api/groups/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGroup(groupRes.data);

        // Fetch expenses (now includes name everywhere)
        const expensesRes = await axios.get(
          `http://localhost:4000/api/expenses/groups/${groupId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setExpenses(expensesRes.data);

        // Fetch settlements (backend already includes from_name & to_name)
        const settlementsRes = await axios.get(`http://localhost:4000/api/${groupId}`);
        if (settlementsRes.data?.success) setSettlements(settlementsRes.data.settlements);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId, token]);

  // ---------------- Loading / Not found ----------------
  if (loading)
    return (
      <div className={styles.loadingWrapper}>
        <h2>Loading group...</h2>
      </div>
    );

  if (!group)
    return (
      <div className={styles.loadingWrapper}>
        <h2>Group not found</h2>
      </div>
    );

  return (
    <div className={styles.wrapper}>
      <Sidebar />

      <div className={styles.rightSide}>
        <SectionNav />

        <div className={styles.content}>
          {/* ---------- Group Header ---------- */}
          <h1 className={styles.title}>{group.group_name}</h1>
          <p className={styles.description}>{group.group_description}</p>
          <p className={styles.meta}>
            <strong>Created:</strong>{" "}
            {group.created_at ? new Date(group.created_at).toLocaleDateString() : "Unknown"}
          </p>

          {/* ---------- Members Section ---------- */}
          <section id="members-section" className={styles.section}>
            <h2 className={styles.sectionTitle}>Members</h2>
            {group.members?.length === 0 ? (
              <p>No members found.</p>
            ) : (
              <ul className={styles.memberList}>
                {group.members.map((m) => (
                  <li key={m.id} className={styles.memberItem}>
                    <span className={styles.memberName}>{m.name}</span> —{" "}
                    <span className={styles.memberEmail}>{m.email}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
   
          {/* ---------- Expenses Section ---------- */}
<section id="expenses-section" className={styles.section}>
  <div className={styles.sectionHeader}>
    <h2 className={styles.sectionTitle}>Expenses</h2>
    <button className={styles.addButton} onClick={() => setShowAddExpenseModal(true)}>
      +
    </button>
  </div>

  {expenses.length === 0 ? (
    <p>No expenses recorded.</p>
  ) : (
    <div className={styles.expenseList}>
      {expenses.map((e) => {
        // Compute payer name for this expense
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
                    <span className={styles.splitType}>
                      ({isPercentage ? "Percentage" : "Exact"})
                    </span>
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

          {/* ---------- Settlements Section ---------- */}
          <section id="settlement-section" className={styles.section}>
            <h2 className={styles.sectionTitle}>Settlements</h2>
            <button
              className={styles.settlementToggleBtn}
              onClick={() => setShowSettlements(!showSettlements)}
            >
              {showSettlements ? "Hide Settlements" : "Show Settlements"}
            </button>

            {showSettlements && (
              <div className={styles.settlementList}>
                {settlements.length === 0 ? (
                  <p>No settlements required 🎉</p>
                ) : (
                  settlements.map((s, index) => (
                    <div key={index} className={styles.settlementCard}>
                      <p className={styles.settlementText}>
                        <strong>{s.from_name}</strong> → owes → <strong>{s.to_name}</strong>
                      </p>
                      <p className={styles.settlementAmount}>Amount: ₹{s.amount}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </section>

          {/* ---------- Add Expense Modal ---------- */}
          {showAddExpenseModal && (
            <AddExpenseModal
              isOpen={showAddExpenseModal}
              onClose={() => setShowAddExpenseModal(false)}
              groupId={groupId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
