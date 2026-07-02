import React, { useState } from "react";
import Card from "../../components/ui/Card";
import { C } from "../../theme/colors";

const REPORT_TYPES = [
  { id: "financial_summary", label: "Monthly Financial Summary", desc: "Revenue, expenses, profit, and pending invoices" },
  { id: "customer_overview", label: "Customer Overview", desc: "Customer breakdown, top spenders, follow-up candidates" },
  { id: "expense_breakdown", label: "Expense Breakdown", desc: "Spend by category and notable trends" },
  { id: "employee_report", label: "Employee Report", desc: "Headcount, departments, payroll cost" },
  { id: "inventory_status", label: "Inventory Status", desc: "Stock levels and low-stock alerts" },
];

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState(REPORT_TYPES[0].id);
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateReport = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          reportType: selectedType || undefined,
          customPrompt: customPrompt || undefined,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || "Failed to generate report");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content" style={{ padding: "28px", overflowY: "auto", flex: 1 }}>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", color: C.text, margin: "0 0 8px 0" }}>Reports</h1>
      <p style={{ color: C.textMuted, marginBottom: 24 }}>
        Generate an AI-written PDF report from your real business data.
      </p>

      {error && (
        <div style={{ background: "#ff000020", border: "1px solid #ff4444", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#ff4444", fontSize: "0.85rem" }}>
          ⚠ {error}
        </div>
      )}

      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.05rem", marginBottom: 16, color: C.text, }}>
          Choose a report type
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {REPORT_TYPES.map(t => (
            <div
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              style={{
                padding: 14,
                borderRadius: 10,
                border: `1px solid ${selectedType === t.id ? C.accent : C.cardBorder}`,
                background: selectedType === t.id ? `${C.accent}15` : "transparent",
                cursor: "pointer",
              }}
            >
              <p style={{ fontWeight: 600, fontSize: "0.9rem", color: C.text, marginBottom: 4 }}>{t.label}</p>
              <p style={{ fontSize: "0.78rem", color: C.textMuted }}>{t.desc}</p>
            </div>
          ))}
          <div
            onClick={() => setSelectedType("")}
            style={{
              padding: 14,
              borderRadius: 10,
              border: `1px solid ${selectedType === "" ? C.accent : C.cardBorder}`,
              background: selectedType === "" ? `${C.accent}15` : "transparent",
              cursor: "pointer",
            }}
          >
            <p style={{ fontWeight: 600, fontSize: "0.9rem", color: C.text, marginBottom: 4 }}>Custom only</p>
            <p style={{ fontSize: "0.78rem", color: C.textMuted }}>Use just the prompt below, no template</p>
          </div>
        </div>
      </Card>

      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.05rem", marginBottom: 10, color: C.text, }}>
          Add custom instructions {selectedType && "(optional)"}
        </h3>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder='e.g. "Focus only on Q2" or "Compare this month to last month" or write your own report request entirely'
          rows={4}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            background: "#ffffff08",
            border: `1px solid ${C.cardBorder}`,
            color: C.text,
            fontSize: "0.88rem",
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />
      </Card>

      <button
        onClick={generateReport}
        disabled={loading || (!selectedType && !customPrompt)}
        style={{
          padding: "12px 24px",
          borderRadius: 10,
          border: "none",
          background: C.accent,
          color: "#fff",
          fontWeight: 600,
          cursor: loading ? "default" : "pointer",
          opacity: loading || (!selectedType && !customPrompt) ? 0.6 : 1,
        }}
      >
        {loading ? "Generating…" : "Generate PDF Report"}
      </button>
    </div>
  );
}