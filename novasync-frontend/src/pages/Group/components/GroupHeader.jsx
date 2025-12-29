import React from "react";
import styles from "../GroupPage.module.css";

export default function GroupHeader({ group }) {
  return (
    <>
      <h1 className={styles.title}>{group.group_name}</h1>
      <p className={styles.description}><b>Description: </b>{group.group_description}</p>
      <p className={styles.meta}>
        <strong>Created:</strong>{" "}
        {group.created_at ? new Date(group.created_at).toLocaleDateString() : "Unknown"}
      </p>
    </>
  );
}
