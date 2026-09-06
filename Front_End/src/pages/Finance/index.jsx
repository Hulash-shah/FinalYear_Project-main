import React, { useState } from "react";
import StatCard from "../../components/ui/StatCard";
import { C } from "../../theme/colors";
import { fmt } from "../../utils/formatters";
import FinanceChart from "./FinanceChart";
import InvoicesList from "./InvoicesList";
import ExpensesList from "./ExpensesList";
import PurchasesList from "./PurchasesList";
import AddInvoiceModal from "./AddInvoiceModal";
import AddExpenseModal from "./AddExpenseModal";
import AddPurchaseModal from "./AddPurchaseModal";




export default function FinancePage({ data, setData }) {

  const [showInvoice, setShowInvoice] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingPurchase, setEditingPurchase] = useState(null);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  
  // CREATE / UPDATE INVOICE
 

  const saveInvoice = async (invoice) => {
  try {
    const isEditing = Boolean(invoice._id);
    const url = isEditing
      ? `http://localhost:5000/api/invoices/${invoice._id}`
      : "http://localhost:5000/api/invoices";

    const res = await fetch(url, {
      method: isEditing ? "PUT" : "POST",
      headers: authHeaders,
      body: JSON.stringify(invoice),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      alert(result.message || "Failed to save invoice.");
      return;
    }

    setData(prev => ({
      ...prev,
      invoices: isEditing
        ? prev.invoices.map(i => (i._id === result.data._id ? result.data : i))
        : [result.data, ...prev.invoices],
    }));

    setShowInvoice(false);
    setEditingInvoice(null);
  } catch (err) {
    console.error(err);
    alert("Failed to save invoice.");
  }
};

  const deleteInvoice = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/invoices/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        alert(result.message || "Failed to delete invoice.");
        return;
      }
      setData(prev => ({
        ...prev,
        invoices: prev.invoices.filter(i => i._id !== id),
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to delete invoice.");
    }
  };

 
  // CREATE / UPDATE EXPENSE
 

  const saveExpense = async (expense) => {
  try {
    const isEditing = Boolean(expense._id);
    const url = isEditing
      ? `http://localhost:5000/api/expenses/${expense._id}`
      : "http://localhost:5000/api/expenses";

    const res = await fetch(url, {
      method: isEditing ? "PUT" : "POST",
      headers: authHeaders,
      body: JSON.stringify(expense),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      alert(result.message || "Failed to save expense.");
      return;
    }

    setData(prev => ({
      ...prev,
      expenses: isEditing
        ? prev.expenses.map(e => (e._id === result.data._id ? result.data : e))
        : [result.data, ...prev.expenses],
    }));

    setShowExpense(false);
    setEditingExpense(null);
  } catch (err) {
    console.error(err);
    alert("Failed to save expense.");
  }
};

  const deleteExpense = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        alert(result.message || "Failed to delete expense.");
        return;
      }
      setData(prev => ({
        ...prev,
        expenses: prev.expenses.filter(e => e._id !== id),
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to delete expense.");
    }
  };

 
  // CREATE / UPDATE PURCHASE
 

  const savePurchase = async (purchase) => {
    try {
      const isEditing = Boolean(purchase._id);
      const url = isEditing
        ? `http://localhost:5000/api/purchases/${purchase._id}`
        : "http://localhost:5000/api/purchases";

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: authHeaders,
        body: JSON.stringify(purchase),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        alert(result.message || "Failed to save purchase.");
        return;
      }

      setData(prev => ({
        ...prev,
        purchases: isEditing
          ? prev.purchases.map(p => (p._id === result.data._id ? result.data : p))
          : [result.data, ...(prev.purchases || [])],
      }));

      setShowPurchase(false);
      setEditingPurchase(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save purchase.");
    }
  };

  const deletePurchase = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/purchases/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        alert(result.message || "Failed to delete purchase.");
        return;
      }
      setData(prev => ({
        ...prev,
        purchases: (prev.purchases || []).filter(p => p._id !== id),
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to delete purchase.");
    }
  };

  // TOTALS
  
  const totalRevenue = data.invoices
    .filter(i => i.status === "Paid")
    .reduce((a, b) => a + b.amount, 0);

  // Count every expense 
  
  const totalExpenses = data.expenses
    .filter(e => e.status !== "Rejected")
    .reduce((a, b) => a + b.amount, 0);

  const netProfit = totalRevenue - totalExpenses;

  // CHART DATA — group real invoices (revenue) and expenses by month
 
  const monthKey = (d) => {
    const dt = new Date(d);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
  };
  const monthLabel = (key) => {
    const [y, m] = key.split("-");
    return new Date(Number(y), Number(m) - 1, 1).toLocaleString("default", { month: "short" });
  };

  const monthMap = {};
  const touchMonth = (date) => {
    const key = monthKey(date);
    if (!monthMap[key]) monthMap[key] = { key, month: monthLabel(key), revenue: 0, expenses: 0 };
    return monthMap[key];
  };

  data.invoices
    .filter(i => i.status === "Paid")
    .forEach(i => { touchMonth(i.date || i.createdAt).revenue += i.amount; });

  data.expenses
    .filter(e => e.status !== "Rejected")
    .forEach(e => { touchMonth(e.date || e.createdAt).expenses += e.amount; });

  const chartData = Object.values(monthMap)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map(m => ({ ...m, profit: m.revenue - m.expenses }));

  const pendingInvoicesAmt = data.invoices
    .filter(
      i =>
        i.status === "Pending" ||
        i.status === "Overdue"
    )
    .reduce((a, b) => a + b.amount, 0);

  return ( <div
  className="page-content"
  style={{
    padding: "28px",
    overflowY: "auto",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  }}
>
  <h1
    style={{
      fontFamily: "'Syne', sans-serif",
      fontSize: "2rem",
      color: C.text,
      margin: "0 0 8px 0",
    }}
  >
    Finance
  </h1>

  <p
    style={{
      color: C.textMuted,
      marginBottom: 24,
    }}
  >
    Track revenue, expenses and invoices.
  </p>

  {/* Top Stat Cards */}

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 16,
      marginBottom: 24,
    }}
  >
    <StatCard
      label="Total Revenue (YTD)"
      value={fmt(totalRevenue)}
     
      icon="rupee"
      color={C.accent}
    />

    <StatCard
      label="Total Expenses (YTD)"
      value={fmt(totalExpenses)}
     
      icon="rupee"
      color={C.danger}
    />

    <StatCard
      label="Net Profit (YTD)"
      value={fmt(netProfit)}
     
      icon="rupee"
      color={C.info}
    />

    <StatCard
      label="Pending Invoices"
      value={fmt(pendingInvoicesAmt)}
      
      icon="rupee"
      color={C.warning}
    />
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: 20,
      marginBottom: 20,
    }}
  >
    <FinanceChart data={chartData} />

    <div
      style={{
        background: C.card,
        borderRadius: 16,
        border: `1px solid ${C.cardBorder}`,
        padding: 24,
      }}
    >
      <h3
        style={{
          marginBottom: 18,
          color: C.text,
        }}
      >
        Quick Actions
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <button
          onClick={() => { setEditingInvoice(null); setShowInvoice(true); }}
          style={{
            padding: 14,
            border: "none",
            borderRadius: 8,
            background: C.accentDim,
            color: C.accent,
            cursor: "pointer",
            fontWeight: 600,
            textAlign: "left",
          }}
        >
          + Create New Invoice
        </button>

        <button
          onClick={() => { setEditingExpense(null); setShowExpense(true); }}
          style={{
            padding: 14,
            border: "none",
            borderRadius: 8,
            background: "rgba(239,68,68,.10)",
            color: C.danger,
            cursor: "pointer",
            fontWeight: 600,
            textAlign: "left",
          }}
        >
          + Record Expense
        </button>

        <button
          onClick={() => { setEditingPurchase(null); setShowPurchase(true); }}
          style={{
            padding: 14,
            border: "none",
            borderRadius: 8,
            background: "rgba(34,197,94,.10)",
            color: C.success,
            cursor: "pointer",
            fontWeight: 600,
            textAlign: "left",
          }}
        >
          + New Purchase
        </button>
      </div>
    </div>
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 20,
      flex: 1,
    }}
  >
    <InvoicesList
      invoices={data.invoices}
      onEdit={(inv) => { setEditingInvoice(inv); setShowInvoice(true); }}
      onDelete={deleteInvoice}
    />

    <ExpensesList
      expenses={data.expenses}
      onEdit={(exp) => { setEditingExpense(exp); setShowExpense(true); }}
      onDelete={deleteExpense}
    />

    <PurchasesList
      purchases={data.purchases || []}
      onEdit={(p) => { setEditingPurchase(p); setShowPurchase(true); }}
      onDelete={deletePurchase}
    />
  </div>

  {/* Invoice Modal */}

  {showInvoice && (
    <AddInvoiceModal
      invoice={editingInvoice}
      onClose={() => { setShowInvoice(false); setEditingInvoice(null); }}
      onSave={saveInvoice}
    />
  )}

  {/* Expense Modal */}

  {showExpense && (
    <AddExpenseModal
      expense={editingExpense}
      onClose={() => { setShowExpense(false); setEditingExpense(null); }}
      onSave={saveExpense}
    />
  )}

  {/* Purchase Modal */}

  {showPurchase && (
    <AddPurchaseModal
      purchase={editingPurchase}
      onClose={() => { setShowPurchase(false); setEditingPurchase(null); }}
      onSave={savePurchase}
    />
  )}
</div>
);
}