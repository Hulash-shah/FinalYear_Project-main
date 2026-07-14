import React, { useState, useEffect } from "react";
import { C } from "../../theme/colors";

export default function AddPurchaseModal({ onClose, onSave, purchase: existingPurchase }) {
  const isEditing = Boolean(existingPurchase);

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  const [selectedUnitCost, setSelectedUnitCost] = useState("");

  useEffect(() => {
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
    loadProducts();
  }, []);

  const [purchase, setPurchase] = useState(() => existingPurchase ? {
    supplier: existingPurchase.supplier || "",
    purchaseNumber: existingPurchase.purchaseNumber || "",
    date: existingPurchase.date ? existingPurchase.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
    notes: existingPurchase.notes || "",
    items: existingPurchase.items || [],
  } : {
    supplier: "",
    purchaseNumber: "",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
    items: [],
  });

  const hasItems = purchase.items.length > 0;

  const recalcTotal = (items) => items.reduce((sum, it) => sum + (it.unitCost * it.quantity), 0);

  const handleAddItem = () => {
    if (!selectedProductId || selectedQty < 1) return;
    const product = products.find(p => p._id === selectedProductId);
    if (!product) return;

    const unitCost = selectedUnitCost !== "" ? Number(selectedUnitCost) : Number(product.price);

    // If this product is already in the list, bump its quantity instead
    // of adding a duplicate row.
    const existingIdx = purchase.items.findIndex(it => it.productId === selectedProductId);
    let newItems;
    if (existingIdx >= 0) {
      newItems = purchase.items.map((it, idx) =>
        idx === existingIdx ? { ...it, quantity: it.quantity + Number(selectedQty) } : it
      );
    } else {
      newItems = [
        ...purchase.items,
        {
          productId: product._id,
          name: product.name,
          unitCost,
          quantity: Number(selectedQty),
        },
      ];
    }

    setPurchase({ ...purchase, items: newItems });
    setSelectedProductId("");
    setSelectedQty(1);
    setSelectedUnitCost("");
  };

  const handleRemoveItem = (productId) => {
    const newItems = purchase.items.filter(it => it.productId !== productId);
    setPurchase({ ...purchase, items: newItems });
  };

  const handleQtyEdit = (productId, qty) => {
    const q = Math.max(1, Number(qty) || 1);
    const newItems = purchase.items.map(it =>
      it.productId === productId ? { ...it, quantity: q } : it
    );
    setPurchase({ ...purchase, items: newItems });
  };

  const handleCostEdit = (productId, cost) => {
    const c = Math.max(0, Number(cost) || 0);
    const newItems = purchase.items.map(it =>
      it.productId === productId ? { ...it, unitCost: c } : it
    );
    setPurchase({ ...purchase, items: newItems });
  };

  const handleSubmit = () => {
    if (!purchase.supplier || !hasItems) {
      alert("Please provide a supplier and at least one item.");
      return;
    }

    onSave({
      ...purchase,
      totalCost: recalcTotal(purchase.items),
      ...(isEditing && { _id: existingPurchase._id }),
    });

    onClose();
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={{ marginBottom: 20 }}>{isEditing ? "Edit Purchase" : "New Purchase"}</h2>

        <input
          style={input}
          placeholder="Supplier"
          value={purchase.supplier}
          onChange={(e) =>
            setPurchase({ ...purchase, supplier: e.target.value })
          }
        />

        <input
          style={input}
          placeholder="Purchase Number (optional)"
          value={purchase.purchaseNumber}
          onChange={(e) =>
            setPurchase({ ...purchase, purchaseNumber: e.target.value })
          }
        />

        <label style={{ fontSize: "0.8rem", color: C.textMuted, display: "block", marginBottom: 4 }}>
          Items — auto-adds stock on save
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
                {p.name} ({p.stock} in stock)
              </option>
            ))}
          </select>
          <input
            style={{ ...input, marginBottom: 0, flex: 1 }}
            type="number"
            min="1"
            placeholder="Qty"
            value={selectedQty}
            onChange={(e) => setSelectedQty(e.target.value)}
          />
          <input
            style={{ ...input, marginBottom: 0, flex: 1 }}
            type="number"
            
            
            placeholder="Cost"
            value={selectedUnitCost}
            onChange={(e) => setSelectedUnitCost(e.target.value)}
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
            {purchase.items.map(it => (
              <div key={it.productId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: "0.85rem", color: C.text, flex: 1 }}>{it.name}</span>
                <input
                  type="number"
                  min="1"
                  value={it.quantity}
                  onChange={(e) => handleQtyEdit(it.productId, e.target.value)}
                  style={{ width: 55, padding: "4px 8px", borderRadius: 6, border: `1px solid ${C.cardBorder}`, background: C.bg, color: C.text }}
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={it.unitCost}
                  onChange={(e) => handleCostEdit(it.productId, e.target.value)}
                  style={{ width: 70, padding: "4px 8px", borderRadius: 6, border: `1px solid ${C.cardBorder}`, background: C.bg, color: C.text }}
                />
                <span style={{ fontSize: "0.8rem", color: C.textMuted, width: 80, textAlign: "right" }}>
                  ₹{(it.unitCost * it.quantity).toFixed(2)}
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
              Total: ₹{recalcTotal(purchase.items).toFixed(2)}
            </p>
          </div>
        )}

        <label style={{ fontSize: "0.8rem", color: C.textMuted, display: "block", marginBottom: 4 }}>
          Date
        </label>
        <input
          style={input}
          type="date"
          value={purchase.date}
          onChange={(e) =>
            setPurchase({ ...purchase, date: e.target.value })
          }
        />

        <input
          style={input}
          placeholder="Notes (optional)"
          value={purchase.notes}
          onChange={(e) =>
            setPurchase({ ...purchase, notes: e.target.value })
          }
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>

          <button style={cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button style={saveBtn} onClick={handleSubmit}>
            {isEditing ? "Update Purchase" : "Save Purchase"}
          </button>

        </div>
      </div>
    </div>
  );
}

// CSS
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
  width: 480,
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