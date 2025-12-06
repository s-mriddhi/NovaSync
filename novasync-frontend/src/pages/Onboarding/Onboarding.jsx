import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Onboarding.module.css";

const Onboarding = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/home");
  };

  return (
    <div className={styles.container}>
      <h1>Welcome to Novasync!</h1>
      <p>This is your onboarding page.</p>
      <button className={styles.nextBtn} onClick={handleNext}>Next</button>
    </div>
  );
};

export default Onboarding;
