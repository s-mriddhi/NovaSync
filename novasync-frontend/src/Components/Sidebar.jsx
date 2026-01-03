import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Sidebar.module.css";
import avatar from "../assets/avatar.png";
import logo from "../assets/NovaSync_logo.png";



export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const goHome = () => navigate("/home");
  
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const encodedEmail = encodeURIComponent(user.email);

        const res = await axios.get(
          `http://localhost:4000/api/groups/user/${encodedEmail}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setGroups(Array.isArray(res.data.groups) ? res.data.groups : []);
      } catch (err) {
        console.error("Error fetching groups:", err);
        setError("Unable to load groups");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className={styles.sidebar}>
      <img
    src={logo}
    alt="text"
    className={styles.logo}
  />
      {/* USER PROFILE */}
      <div className={styles.userSection}>   
  <img
    src={avatar}
    alt="profile"
    className={styles.avatar}
    
  />
        <div className={styles.username}>User: {user?.name || "User"}</div>
        <div className={styles.email}>{user?.email || "No email"}</div>
        <button className={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* HOME BUTTON */}
      <button className={styles.homeButton} onClick={goHome}>
         Home
      </button>

      <hr className={styles.divider} />

      {/* GROUPS HEADER */}
      <div className={styles.groupsHeader}>Your Groups
        <button className={styles.addGroupBtn}>+</button>
      </div>

      {loading && <div className={styles.info}>Loading groups...</div>}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.groupList}>
        {!loading && groups.length === 0 && (
          <div className={styles.info}>No groups found.</div>
        )}

        {groups.map((group) => (
          <div
            key={group.id}
            className={styles.groupItem}
            onClick={() => navigate(`/group/${group.id}`)}
          >
            {group.group_name}
          </div>
        ))}
      </div>
    </div>
  );
}
