import React, { useState, useEffect } from "react";
import { C } from "../../theme/colors";

export default function AddInvoiceModal({ onClose, onSave, invoice: existingInvoice }) {
  const isEditing = Boolean(existingInvoice);

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await fetch("http://localhost:5000/api/customers", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const result = await res.json();
        if (result.success) setCustomers(result.data);
      } catch (err) {
        console.error("Failed to load customers:", err);
      }
    }
    loadCustomers();
  }, []);

 const [invoice, setInvoice] = useState(() => existingInvoice ? {
  customerId: existingInvoice.customerId || "",
  client: existingInvoice.client || "",
  invoiceNumber: existingInvoice.invoiceNumber || "",
  amount: existingInvoice.amount || "",
  date: existingInvoice.date ? existingInvoice.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
  dueDate: existingInvoice.dueDate ? existingInvoice.dueDate.slice(0, 10) : "",
  status: existingInvoice.status || "Pending",
  newCustomerEmail: "",
  newCustomerPhone: "",
  newCustomerCompany: "",
 } : {
  customerId: "",
  client: "",
  invoiceNumber: "",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  dueDate: "",
  status: "Pending",
  newCustomerEmail: "",
  newCustomerPhone: "",
  newCustomerCompany: "",
});

  // Only treat this as "creating a brand new customer" when there's a
  // client name typed but no existing customer has been selected.
  const isNewCustomer = Boolean(invoice.client) && !invoice.customerId;

  const handleCustomerChange = (id) => {
    const selected = customers.find(c => c._id === id);
    setInvoice({
      ...invoice,
      customerId: id,
      client: selected ? selected.name : invoice.client,
      newCustomerEmail: "",
      newCustomerPhone: "",
      newCustomerCompany: "",
    });
  };

  const handleSubmit = () => {
 if (!invoice.client || !invoice.amount || !invoice.dueDate) {
  alert("Please fill all fields.");
  return;
}
  if (isNewCustomer && !invoice.newCustomerEmail) {
    alert("Please provide an email for the new customer, so they're saved properly on your Customers page.");
    return;
  }
  onSave({
    ...invoice,
    amount: Number(invoice.amount),
    customerId: invoice.customerId || undefined,
    ...(isEditing && { _id: existingInvoice._id }),
  });

  onClose();
};


  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={{ marginBottom: 20 }}>{isEditing ? "Edit Invoice" : "Create Invoice"}</h2>

        <label style={{ fontSize: "0.8rem", color: C.textMuted, display: "block", marginBottom: 4 }}>
          Customer
        </label>
        <select
          style={input}
          value={invoice.customerId}
          onChange={(e) => handleCustomerChange(e.target.value)}
        >
          <option value="">— Select existing customer (optional) —</option>
          {customers.map(c => (
            <option key={c._id} value={c._id}>{c.name}{c.company ? ` (${c.company})` : ""}</option>
          ))}
        </select>

        <input
  style={input}
  placeholder="Client Name"
  value={invoice.client}
  onChange={(e) =>
    setInvoice({ ...invoice, client: e.target.value, customerId: "" })
  }
/>

        {isNewCustomer && (
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 12, marginBottom: 15 }}>
            <p style={{ fontSize: "0.75rem", color: C.textMuted, marginBottom: 10 }}>
              New client — this will also be saved to your Customers page.
            </p>
            <input
              style={{ ...input, marginBottom: 10 }}
              placeholder="Customer Email *"
              type="email"
              value={invoice.newCustomerEmail}
              onChange={(e) => setInvoice({ ...invoice, newCustomerEmail: e.target.value })}
            />
            <input
              style={{ ...input, marginBottom: 10 }}
              placeholder="Phone (optional)"
              value={invoice.newCustomerPhone}
              onChange={(e) => setInvoice({ ...invoice, newCustomerPhone: e.target.value })}
            />
            <input
              style={{ ...input, marginBottom: 0 }}
              placeholder="Company (optional)"
              value={invoice.newCustomerCompany}
              onChange={(e) => setInvoice({ ...invoice, newCustomerCompany: e.target.value })}
            />
          </div>
        )}

        <input
            style={input}
           placeholder="Invoice Number"
           value={invoice.invoiceNumber}
           onChange={(e) =>
         setInvoice({ ...invoice, invoiceNumber: e.target.value })
  }
/>

        <input
          style={input}
          type="number"
          placeholder="Amount"
          value={invoice.amount}
          onChange={(e) =>
            setInvoice({ ...invoice, amount: e.target.value })
          }
        />

        <label style={{ fontSize: "0.8rem", color: C.textMuted, display: "block", marginBottom: 4 }}>
          Issue Date
        </label>
        <input
          style={input}
          type="date"
          value={invoice.date}
          onChange={(e) =>
            setInvoice({ ...invoice, date: e.target.value })
          }
        />

        <label style={{ fontSize: "0.8rem", color: C.textMuted, display: "block", marginBottom: 4 }}>
          Due Date
        </label>
        <input
          style={input}
          type="date"
          value={invoice.dueDate}
          onChange={(e) =>
            setInvoice({ ...invoice, dueDate: e.target.value })
          }
        />

        <select
          style={input}
          value={invoice.status}
          onChange={(e) =>
            setInvoice({ ...invoice, status: e.target.value })
          }
        >
          <option>Pending</option>
          <option>Paid</option>
          <option>Overdue</option>
        </select>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>

          <button style={cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button style={saveBtn} onClick={handleSubmit}>
            {isEditing ? "Update Invoice" : "Save Invoice"}
          </button>

        </div>
      </div>
    </div>
  );
}

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