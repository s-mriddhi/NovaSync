import React from "react";
import styles from "./Members.module.css";

export default function Members({ members }) {
  if (!members || members.length === 0) {
    return <p>No members found.</p>;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Members</h2>
      <ul className={styles.memberList}>
        {members.map((m) => (
          <li key={m.id} className={styles.memberItem}>
            <span className={styles.memberName}>{m.name}</span> —{" "}
            <span className={styles.memberEmail}>{m.email}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
