import React, { useState } from "react";
import axios from "axios";
import styles from "./CreateGroup.module.css";

export default function CreateGroupModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [memberEmails, setMemberEmails] = useState([""]);

  const handleAddEmail = () => {
    setMemberEmails([...memberEmails, ""]);
  };

  const handleRemoveEmail = (index) => {
    const copy = [...memberEmails];
    copy.splice(index, 1);
    setMemberEmails(copy);
  };

  const handleEmailChange = (index, value) => {
    const copy = [...memberEmails];
    copy[index] = value;
    setMemberEmails(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const loggedUser = JSON.parse(localStorage.getItem("user"));

      const memberIds = [];

      // Add logged-in user always
      memberIds.push(loggedUser.id);

      // Convert each email → userId
      for (const email of memberEmails) {
        if (!email.trim()) continue;

        const res = await axios.get(
          `http://localhost:4000/api/users?email=${email}`
        );

        if (!res.data?.userId) {
          alert(`User not found: ${email}`);
          return;
        }

        memberIds.push(res.data.userId);
      }

      // POST create group
      await axios.post(
        "http://localhost:4000/api/groups",
        {
          groupName,
          groupDescription,
          memberIds,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onClose();
    } catch (err) {
      console.error(err);
      alert("Error creating group");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 style={{ fontStyle: "initial", color: "#490551" }}>Enter Group Details</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Group Name</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />

          <label>Group Description</label>
          <textarea
  value={groupDescription}
  onChange={(e) => setGroupDescription(e.target.value)}
  style={{
    borderRadius: "12px",
    padding: "10px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px",
    resize: "vertical",
    
  }}
/>

          <label>Members (Email)</label>

          {memberEmails.map((email, index) => (
            <div key={index} className={styles.emailRow}>
              <input
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
              />

              {memberEmails.length > 1 && (
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleRemoveEmail(index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className={styles.addEmailBtn}
            onClick={handleAddEmail}
          >
            + Add Member
          </button>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className={styles.createBtn}>
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
