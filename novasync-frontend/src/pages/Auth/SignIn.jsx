import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./SignIn.module.css";
import myPic from "/Users/pabbucooldude/novasync/novasync-frontend/src/assets/NovaSync.png";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/home");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
     <div
  style={{
    backgroundImage: `url(${myPic})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    width: "400px",
    height: "200px",
   }}
/><div style={{border: '0.8px solid #f0f3deff', padding: '28px', borderRadius: '12px', backgroundColor: '#fbfbfbff'}}>
      <h2 style={{color: '#41353cff'}}>Sign In</h2>
      <form onSubmit={handleLogin} className={styles.form}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div></div>
  );
}
