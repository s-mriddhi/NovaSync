import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import styles from "./GroupPage.module.css";

export default function GroupPage() {
  const { groupId } = useParams();
  const token = localStorage.getItem("token");
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/groups/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setGroup(res.data);
      } catch (error) {
        console.error("Error fetching group:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId]);

  if (loading)
    return (
      <div className={styles.loadingWrapper}>
        <h2>Loading group...</h2>
      </div>
    );

  if (!group)
    return (
      <div className={styles.loadingWrapper}>
        <h2>Group not found</h2>
      </div>
    );

  return (
    <div className={styles.wrapper}>
      <Sidebar />

      <div className={styles.content}>
        <h1 className={styles.title}>{group.group_name}</h1>
        <p className={styles.description}>{group.group_description}</p>
        <p className={styles.meta}>
          <strong>Created:</strong>{" "}
          {group.created_at
            ? new Date(group.created_at).toLocaleDateString()
            : "Unknown"}
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Members</h2>
          {group.members?.length === 0 ? (
            <p>No members found.</p>
          ) : (
            <ul className={styles.memberList}>
              {group.members?.map((m) => (
                    <li key={m.id} className={styles.memberItem}>
                        <span className={styles.memberName}>{m.name}</span> — <span className={styles.memberEmail}>{m.email}</span>
                     </li>
                ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
