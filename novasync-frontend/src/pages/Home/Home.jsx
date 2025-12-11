import React, { useState } from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import CreateGroupModal from "../../Components/CreateGroup";  
// make sure file name matches: CreateGroupModal.jsx

export default function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const handleCreateGroup = () => {
    setShowCreateGroup(true);    // open popup (NOT navigate)
  };

  return (
    <div className={styles.mainLayout}>
      {/* LEFT FIXED SIDEBAR */}
      <Sidebar />

      {/* RIGHT CONTENT */}
      <div className={styles.rightPanel}>
        <div className={styles.homeWrapper}>
          <h1>Welcome, {user?.name || "User"} 👋</h1>

          <p className={styles.subtitle}>
            Your one-stop solution for managing shared expenses.
          </p>

          {/* Create Group Button */}
          <button className={styles.createBtn} onClick={handleCreateGroup}>
            Create Group
          </button>

          {/* Popup Modal */}
          {showCreateGroup && (
            <CreateGroupModal
              isOpen={showCreateGroup}
              onClose={() => setShowCreateGroup(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
