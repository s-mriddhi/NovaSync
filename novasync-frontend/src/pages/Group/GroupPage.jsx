import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Sidebar from "../../Components/Sidebar";
import SectionNav from "../../Components/SectionNav";
import AddExpenseModal from "../../Components/AddExpenseModal";

import GroupHeader from "./components/GroupHeader";
import MembersSection from "./components/MembersSection";
import ExpensesSection from "./components/ExpensesSection";
import SettlementsSection from "./components/SettlementsSection";
import GroupSummary from "./components/GroupSummary"; 

import styles from "./GroupPage.module.css";

export default function GroupPage() {
  const { groupId } = useParams();
  const token = localStorage.getItem("token");

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showSettlements, setShowSettlements] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupRes = await axios.get(`http://localhost:4000/api/groups/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroup(groupRes.data);

        const expensesRes = await axios.get(
          `http://localhost:4000/api/expenses/groups/${groupId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setExpenses(expensesRes.data);

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

  if (loading) return <div className={styles.loadingWrapper}><h2>Loading group...</h2></div>;
  if (!group) return <div className={styles.loadingWrapper}><h2>Group not found</h2></div>;

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.rightSide}>
        <SectionNav />
        <div className={styles.content}>
          <div className={styles.groupTopRow}>
  <div className={styles.groupHeaderStack}>
    <GroupHeader group={group} />
  </div>

  <GroupSummary
    group={{ ...group, expenses }}
  />
</div>
          <MembersSection members={group.members} />
          <ExpensesSection
            expenses={expenses}
            group={group}
            showAddExpenseModal={showAddExpenseModal}
            setShowAddExpenseModal={setShowAddExpenseModal}
          />
          <SettlementsSection
            settlements={settlements}
            showSettlements={showSettlements}
            setShowSettlements={setShowSettlements}
          />
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
