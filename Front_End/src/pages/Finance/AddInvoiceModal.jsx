import React, { useState, useEffect } from "react";
import { C } from "../../theme/colors";

export default function AddInvoiceModal({ onClose, onSave, invoice: existingInvoice }) {
  const isEditing = Boolean(existingInvoice);

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);

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
    async function loadProducts() {
      try {
        const res = await fetch("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const result = await res.json();
        if (result.success) setProducts(result.data);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    }
    loadCustomers();
    loadProducts();
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
  items: existingInvoice.items || [],
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
  items: [],
});

  const isNewCustomer = Boolean(invoice.client) && !invoice.customerId;
  const hasItems = invoice.items.length > 0;

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

  // Recalculate amount from item line totals whenever items change.
  const recalcAmount = (items) => {
    const total = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
    return total;
  };

  const handleAddItem = () => {
    if (!selectedProductId || selectedQty < 1) return;
    const product = products.find(p => p._id === selectedProductId);
    if (!product) return;

    // If this product is already in the list, bump its quantity instead
    // of adding a duplicate row.
    const existingIdx = invoice.items.findIndex(it => it.productId === selectedProductId);
    let newItems;
    if (existingIdx >= 0) {
      newItems = invoice.items.map((it, idx) =>
        idx === existingIdx ? { ...it, quantity: it.quantity + Number(selectedQty) } : it
      );
    } else {
      newItems = [
        ...invoice.items,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: Number(selectedQty),
        },
      ];
    }

    setInvoice({ ...invoice, items: newItems, amount: recalcAmount(newItems) });
    setSelectedProductId("");
    setSelectedQty(1);
  };

  const handleRemoveItem = (productId) => {
    const newItems = invoice.items.filter(it => it.productId !== productId);
    setInvoice({
      ...invoice,
      items: newItems,
      amount: newItems.length > 0 ? recalcAmount(newItems) : invoice.amount,
    });
  };

  const handleQtyEdit = (productId, qty) => {
    const q = Math.max(1, Number(qty) || 1);
    const newItems = invoice.items.map(it =>
      it.productId === productId ? { ...it, quantity: q } : it
    );
    setInvoice({ ...invoice, items: newItems, amount: recalcAmount(newItems) });
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

        
        <label style={{ fontSize: "0.8rem", color: C.textMuted, display: "block", marginBottom: 4 }}>
          Products (optional — auto-deducts stock)
        </label>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <select
            style={{ ...input, marginBottom: 0, flex: 3 }}
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            <option value="">— Select product —</option>
            {products.map(p => (
              <option key={p._id} value={p._id}>
                {p.name} (₹{Number(p.price).toFixed(2)}, {p.stock} in stock)
              </option>
            ))}
          </select>
          <input
            style={{ ...input, marginBottom: 0, flex: 1 }}
            type="number"
            min="1"
            value={selectedQty}
            onChange={(e) => setSelectedQty(e.target.value)}
          />
          <button
            type="button"
            onClick={handleAddItem}
            style={{ ...saveBtn, marginBottom: 0, flexShrink: 0 }}
          >
            Add
          </button>
        </div>

        {hasItems && (
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 12, marginBottom: 15 }}>
            {invoice.items.map(it => (
              <div key={it.productId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: "0.85rem", color: C.text, flex: 1 }}>{it.name}</span>
                <input
                  type="number"
                  min="1"
                  value={it.quantity}
                  onChange={(e) => handleQtyEdit(it.productId, e.target.value)}
                  style={{ width: 60, padding: "4px 8px", borderRadius: 6, border: `1px solid ${C.cardBorder}`, background: C.bg, color: C.text }}
                />
                <span style={{ fontSize: "0.8rem", color: C.textMuted, width: 80, textAlign: "right" }}>
                  ₹{(it.price * it.quantity).toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(it.productId)}
                  style={{ background: "transparent", border: "none", color: C.danger, cursor: "pointer", fontWeight: 600 }}
                >
                  ×
                </button>
              </div>
            ))}
            <p style={{ fontSize: "0.78rem", color: C.textMuted, margin: "8px 0 0 0", textAlign: "right" }}>
              Total: ₹{recalcAmount(invoice.items).toFixed(2)}
            </p>
          </div>
        )}

        <input
          style={input}
          type="number"
          placeholder="Amount"
          value={invoice.amount}
          readOnly={hasItems}
          onChange={(e) =>
            setInvoice({ ...invoice, amount: e.target.value })
          }
        />
        {hasItems && (
          <p style={{ fontSize: "0.72rem", color: C.textMuted, marginTop: -10, marginBottom: 15 }}>
            Amount is calculated automatically from the products above.
          </p>
        )}

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

// CSS used
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
  maxHeight: "90vh",
  overflowY: "auto",
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 15,
  background: C.bg,
  border: `1px solid ${C.cardBorder}`,
  color: C.text,
  borderRadius: 10,
  boxSizing: "border-box",
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