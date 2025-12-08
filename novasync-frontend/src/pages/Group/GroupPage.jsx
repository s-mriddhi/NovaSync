import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import styles from "./GroupPage.module.css";
import SectionNav from "../../Components/SectionNav";


export default function GroupPage() {
  const { groupId } = useParams();
  const token = localStorage.getItem("token");

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [showSettlements, setShowSettlements] = useState(false);

  // ---------------- Fetch Settlements ----------------
  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/${groupId}`);
        if (res.data?.success) setSettlements(res.data.settlements);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettlements();
  }, [groupId]);

  // ---------------- Fetch Group + Expenses ----------------
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/groups/${groupId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGroup(res.data);
      } catch (error) {
        console.error("Error fetching group:", error);
      }
    };

    const fetchExpenses = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/expenses/groups/${groupId}/expenses`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setExpenses(res.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
    fetchExpenses();
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
          {group.created_at
            ? new Date(group.created_at).toLocaleDateString()
            : "Unknown"}
        </p>

        {/* --------------------------------------------------- */}
        {/* ---------------- MEMBERS SECTION ------------------ */}
        {/* --------------------------------------------------- */}
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

        {/* --------------------------------------------------- */}
        {/* ---------------- EXPENSES SECTION ----------------- */}
        {/* --------------------------------------------------- */}
        <section id="expenses-section" className={styles.section}>
          <h2 className={styles.sectionTitle}>Expenses</h2>

          {expenses.length === 0 ? (
            <p>No expenses recorded.</p>
          ) : (
            <div className={styles.expenseList}>
              {expenses.map((e) => (
                <div key={e.id} className={styles.expenseCard}>
                  <div className={styles.expenseHeader}>
                    <h3 className={styles.expenseTitle}>{e.description}</h3>
                    <span className={styles.expenseAmount}>
                      ₹{Number(e.amount)}
                    </span>
                  </div>

                  <p className={styles.expenseMeta}>
                    Paid by <strong>User {e.paid_by}</strong> on{" "}
                    {new Date(e.expense_date).toLocaleDateString()}
                  </p>

                  <div className={styles.splitContainer}>
                    {e.splits.map((s, i) => {
                      const isPercentage = s.split_type === "percentage";

                      return (
                        <div key={i} className={styles.splitRow}>
                          <span className={styles.splitUser}>
                            User {s.user_id}
                          </span>

                          <span className={styles.splitType}>
                            ({isPercentage ? "Percentage" : "Exact"})
                          </span>

                          {isPercentage && (
                            <span className={styles.splitPercent}>
                              ({s.value}%)
                            </span>
                          )}

                          <span className={styles.splitShare}>
                            Expense share: ₹{Number(s.owed_amount)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* --------------------------------------------------- */}
        {/* ---------------- SETTLEMENT SECTION --------------- */}
        {/* --------------------------------------------------- */}
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
                      <strong>User {s.from}</strong> → owes →
                      <strong> User {s.to}</strong>
                    </p>

                    <p className={styles.settlementAmount}>
                      Amount: ₹{s.amount}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
      </div>
    </div>
  );
}
