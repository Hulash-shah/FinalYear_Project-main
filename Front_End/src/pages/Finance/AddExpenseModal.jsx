import React, { useState } from "react";
import { C } from "../../theme/colors";

export default function AddExpenseModal({ onClose, onSave, expense: existingExpense }) {
  const isEditing = Boolean(existingExpense);

  const [expense, setExpense] = useState(() => existingExpense ? {
    title: existingExpense.title || "",
    category: existingExpense.category || "",
    amount: existingExpense.amount || "",
    status: existingExpense.status || "Pending",
    date: existingExpense.date ? existingExpense.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
  } : {
    title: "",
    category: "",
    amount: "",
    status: "Pending",
    date: new Date().toISOString().slice(0, 10),
  });

  const handleSubmit = () => {
    if (!expense.title || !expense.category || !expense.amount) {
      alert("Please fill all fields.");
      return;
    }

    onSave({
      title: expense.title,
      description: expense.title,
      category: expense.category,
      amount: Number(expense.amount),
      status: expense.status,
      date: expense.date,
      ...(isEditing && { _id: existingExpense._id }),
    });

    onClose();
  };

  return (
    <div style={overlay}>
      <div style={modal}>

        <h2 style={{ marginBottom: 20 }}>{isEditing ? "Edit Expense" : "Record Expense"}</h2>

        <input
          style={input}
          placeholder="Expense Name"
          value={expense.title}
          onChange={(e) =>
            setExpense({ ...expense, title: e.target.value })
          }
        />

        <input
          style={input}
          placeholder="Category"
          value={expense.category}
          onChange={(e) =>
            setExpense({ ...expense, category: e.target.value })
          }
        />

        <input
          style={input}
          type="number"
          placeholder="Amount"
          value={expense.amount}
          onChange={(e) =>
            setExpense({ ...expense, amount: e.target.value })
          }
        />

        <select
          style={input}
          value={expense.status}
          onChange={(e) =>
            setExpense({ ...expense, status: e.target.value })
          }
        >
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>

        <label style={{ fontSize: "0.8rem", color: C.textMuted, display: "block", marginBottom: 4 }}>
          Date
        </label>
        <input
          style={input}
          type="date"
          value={expense.date}
          onChange={(e) =>
            setExpense({ ...expense, date: e.target.value })
          }
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>

          <button style={cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button style={saveBtn} onClick={handleSubmit}>
            {isEditing ? "Update Expense" : "Save Expense"}
          </button>

        </div>
      </div>
    </div>
  );
}
// CSS haleko
const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.55)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modal = {
  background: C.card,
  width: 450,
  borderRadius: 18,
  padding: 25,
  border: `1px solid ${C.cardBorder}`,
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 15,
  background: C.bg,
  border: `1px solid ${C.cardBorder}`,
  color: C.text,
  borderRadius: 10,
};

const saveBtn = {
  padding: "10px 18px",
  background: C.accent,
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const cancelBtn = {
  padding: "10px 18px",
  background: "#444",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};