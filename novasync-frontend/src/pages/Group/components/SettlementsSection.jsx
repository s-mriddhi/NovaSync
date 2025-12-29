import React from "react";
import styles from "../GroupPage.module.css";

export default function SettlementsSection({ settlements, showSettlements, setShowSettlements }) {
  return (
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
  );
}
