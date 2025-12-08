import React from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";

export default function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleCreateGroup = () => {
    navigate("/create-group");
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

          <button className={styles.createBtn} onClick={handleCreateGroup}>
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}
