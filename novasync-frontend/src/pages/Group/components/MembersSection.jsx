import React from "react";
import styles from "../GroupPage.module.css";

export default function MembersSection({ members }) {
  return (
    <section id="members-section" className={styles.section}>
      <h2 className={styles.sectionTitle}>Members</h2>
      {members?.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <ul className={styles.memberList}>
          {members.map((m) => (
            <li key={m.id} className={styles.memberItem}>
              <span className={styles.memberName}>{m.name}</span> —{" "}
              <span className={styles.memberEmail}>{m.email}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
