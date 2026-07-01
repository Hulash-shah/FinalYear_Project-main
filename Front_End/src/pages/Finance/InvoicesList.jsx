import React from 'react';
import Card from '../../components/ui/Card';
import { C } from '../../theme/colors';
import { fmt } from '../../utils/formatters';

export default function InvoicesList({ invoices, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    switch(status) {
      case "Paid": return C.success;
      case "Pending": return C.warning;
      case "Overdue": return C.danger;
      default: return C.textMuted;
    }
  };

  return (
    <Card style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.05rem", margin: 0 }}>Recent Invoices</h3>
        <button style={{ background: "transparent", color: C.info, border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
          View All
        </button>
      </div>
      
      <div style={{ overflowY: "auto", flex: 1 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", color: C.text, fontSize: "0.85rem", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.cardBorder}`, color: C.textMuted }}>
              <th style={{ padding: "12px 10px", fontWeight: 500 }}>ID / Client</th>
              <th style={{ padding: "12px 10px", fontWeight: 500 }}>Date & Due</th>
              <th style={{ padding: "12px 10px", fontWeight: 500 }}>Amt & Status</th>
              <th style={{ padding: "12px 10px", fontWeight: 500 }}></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, idx) => (
              <tr key={inv._id} style={{ borderBottom: idx === invoices.length - 1 ? "none" : `1px solid ${C.cardBorder}`, transition: "background 0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,0.02)"} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                <td style={{ padding: "12px 10px" }}>
                  <div style={{ fontWeight: 600, color: C.text }}>{inv.invoiceNumber}</div>
                  <div style={{ color: C.textMuted, fontSize: "0.8rem", marginTop: 2 }}>{inv.client}</div>
                </td>
                <td style={{ padding: "12px 10px", color: C.textDim }}>
                  <div>Iss: {new Date(inv.date || inv.createdAt).toLocaleDateString()}</div>
                  <div style={{ fontSize: "0.8rem", marginTop: 2 }}>Due: {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "-"}</div>
                </td>
                <td style={{ padding: "12px 10px" }}>
                  <div style={{ fontWeight: 600, color: C.text }}>{fmt(inv.amount)}</div>
                  <span style={{ 
                      display: "inline-block",
                      marginTop: 4,
                      padding: "2px 8px", 
                      borderRadius: 12, 
                      background: `${getStatusColor(inv.status)}1A`, 
                      color: getStatusColor(inv.status),
                      fontSize: "0.75rem",
                      fontWeight: 700
                  }}>
                    {inv.status}
                  </span>
                </td>
                <td style={{ padding: "12px 10px", whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => onEdit && onEdit(inv)}
                    style={{ background: "transparent", border: "none", color: C.info, cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, marginRight: 10 }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Delete this invoice?")) onDelete && onDelete(inv._id);
                    }}
                    style={{ background: "transparent", border: "none", color: C.danger, cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}