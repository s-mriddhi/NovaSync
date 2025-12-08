import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import myPic from "/Users/pabbucooldude/novasync/novasync-frontend/src/assets/NovaSync.png";

export default function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
  <div className={styles.wrapper}>
    {/* LEFT SIDE */}
    <div className={styles.container}>
      <div
        style={{
          backgroundImage: `url(${myPic})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: "150px",
          height: "40px",
          paddingBottom: "20px",
        }}
      />

      <div style={{
        border: '0.8px solid #f0f3deff',
        padding: '20px',
        borderRadius: '12px',
        backgroundColor: '#fbfbfbff'
      }}>
        <h2>{user?.name || "User"}</h2>
        <p>Email: {user?.email}</p>
        <button className={styles.logout} onClick={handleLogout}>Logout</button>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className={styles.right}>
      <h2>Welcome!</h2>
      <p style={{ fontSize:"24px" }}>Your one-stop solution for all your synchronization needs.</p>
      <button type="submit">Create Group</button>
    </div>
  </div>
)
}