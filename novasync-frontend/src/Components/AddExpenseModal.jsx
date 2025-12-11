import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AddExpenseModal.module.css";

export default function AddExpenseModal({ isOpen, onClose, groupId, groupMembers }) {
  if (!isOpen) return null;

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [splitType, setSplitType] = useState("exact");
  const [participants, setParticipants] = useState([]);

  const [payerShare, setPayerShare] = useState(0);

  // Initialize participants from group members excluding self
  useEffect(() => {
    if (groupMembers?.length) {
      const membersExceptSelf = groupMembers
        .filter((m) => m.id !== loggedInUser?.id)
        .map((m) => ({ username: m.name, value: "" }));
      setParticipants(membersExceptSelf.length ? membersExceptSelf : [{ username: "", value: "" }]);
    }
  }, [groupMembers, loggedInUser]);

  // Update payer share dynamically based on split type
  useEffect(() => {
    if (!amount) return;

    const totalEntered = participants.reduce((acc, p) => acc + Number(p.value || 0), 0);
    if (splitType === "equal") {
      const totalPeople = participants.length + 1;
      const share = (Number(amount) / totalPeople).toFixed(2);
      setPayerShare(Number(share));
      setParticipants(participants.map((p) => ({ ...p, value: Number(share) })));
    } else if (splitType === "exact") {
      setPayerShare(Number(amount) - totalEntered);
    } else if (splitType === "percentage") {
      const totalPercent = participants.reduce((acc, p) => acc + Number(p.value || 0), 0);
      setPayerShare(100 - totalPercent); // for display only
    }
  }, [amount, participants, splitType]);

  const handleAddParticipant = () => {
    setParticipants([...participants, { username: "", value: "" }]);
  };

  const handleRemoveParticipant = (index) => {
    const copy = [...participants];
    copy.splice(index, 1);
    setParticipants(copy);
  };

  const handleParticipantChange = (index, field, value) => {
    const copy = [...participants];
    copy[index][field] = value;
    setParticipants(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Map usernames → userIds
      const mappedParticipants = [];
      for (const p of participants) {
        if (!p.username.trim()) continue;
        const res = await axios.get(`http://localhost:4000/api/users?username=${p.username}`);
        if (!res.data?.userId) {
          alert(`User not found: ${p.username}`);
          return;
        }
        mappedParticipants.push({ userId: res.data.userId, value: Number(p.value) });
      }

      // Add payer with correct value
      if (splitType === "equal") {
        const totalPeople = mappedParticipants.length + 1;
        const equalShare = (Number(amount) / totalPeople).toFixed(2);
        mappedParticipants.push({ userId: loggedInUser.id, value: Number(equalShare) });
      } else if (splitType === "exact") {
        const totalOthers = mappedParticipants.reduce((acc, p) => acc + Number(p.value), 0);
        const payerValue = Number(amount) - totalOthers;
        mappedParticipants.push({ userId: loggedInUser.id, value: payerValue });
      } else if (splitType === "percentage") {
        const totalPercent = mappedParticipants.reduce((acc, p) => acc + Number(p.value), 0);
        const payerPercent = 100 - totalPercent;
        const payerValue = ((Number(amount) * payerPercent) / 100).toFixed(2);
        mappedParticipants.push({ userId: loggedInUser.id, value: Number(payerValue) });
      }

      // Validation
      const total = mappedParticipants.reduce((acc, p) => acc + Number(p.value), 0);
      if (splitType === "exact" && total !== Number(amount)) {
        alert(`Exact split values must sum to ${amount}. Currently sum is ${total}`);
        return;
      }
      if (splitType === "percentage") {
        const totalPercent = participants.reduce((acc, p) => acc + Number(p.value || 0), 0) + payerShare;
        if (totalPercent !== 100) {
          alert(`Percentages must sum to 100%. Currently sum is ${totalPercent}`);
          return;
        }
      }

      // Prepare payload
      const payload = {
        description,
        amount: Number(amount),
        expenseDate,
        splitType,
        participants: mappedParticipants,
      };

      await axios.post(
        `http://localhost:4000/api/expenses/groups/${groupId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to add expense");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Add Expense</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Description/ Title</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.inputBox}
            required
          />

          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={styles.inputBox}
            required
          />

          <label>Expense Date</label>
          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            className={styles.inputBox}
            required
          />

          <label>Split Type</label>
          <select
            value={splitType}
            onChange={(e) => setSplitType(e.target.value)}
            className={styles.inputBox}
          >
            <option value="exact">Exact</option>
            <option value="percentage">Percentage</option>
            <option value="equal">Equal</option>
          </select>

          <label>Participants (Username)</label>
          {participants.map((p, index) => (
            <div key={index} className={styles.participantRow}>
              <input
                type="text"
                placeholder="Username"
                value={p.username}
                onChange={(e) => handleParticipantChange(index, "username", e.target.value)}
                className={`${styles.inputBox} ${styles.participantName}`}
                required
              />
              <input
                type="number"
                placeholder={splitType === "percentage" ? "Percent" : "Amount"}
                value={p.value}
                onChange={(e) => handleParticipantChange(index, "value", e.target.value)}
                className={`${styles.inputBox} ${styles.participantValue}`}
                required
                readOnly={splitType === "equal"}
              />
              {participants.length > 1 && (
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleRemoveParticipant(index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button type="button" className={styles.addParticipantBtn} onClick={handleAddParticipant}>
            + Add Participant
          </button>

          {/* -------- Live summary for payer -------- */}
          <p className={styles.payerSummary}>
            <strong>{loggedInUser.name}</strong> 's value: {payerShare}
          </p>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

