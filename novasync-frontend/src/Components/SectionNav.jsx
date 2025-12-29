import React, { useState } from "react";
import styles from "./SectionNav.module.css";

export default function SectionNav() {
  const sections = [
    { id: "members-section", label: "Members" },
    { id: "expenses-section", label: "Expenses" },
    { id: "settlement-section", label: "Settlements" },
    { id: "chatbox-section", label: "Chatbox" },
  ];

  const [active, setActive] = useState("members-section");

  const scrollToSection = (id) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={styles.navbar}>
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => scrollToSection(s.id)}
          className={`${styles.navItem} ${
            active === s.id ? styles.active : ""
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
