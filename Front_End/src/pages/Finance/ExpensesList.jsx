import React from 'react';
import Card from '../../components/ui/Card';
import { C } from '../../theme/colors';
import { fmt } from '../../utils/formatters';

export default function ExpensesList({ expenses, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    switch(status) {
      case "Approved": return C.success;
      case "Pending": return C.warning;
      case "Rejected": return C.danger;
      default: return C.textMuted;
    }
  };

  return (
    <Card style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.05rem", margin: 0, color: C.text, }}>Recent Expenses</h3>
        {/* <button style={{ background: "transparent", color: C.info, border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
          View All
        </button> */}
      </div>
      
      <div style={{ overflowY: "auto", flex: 1 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", color: C.text, fontSize: "0.85rem", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.cardBorder}`, color: C.textMuted }}>
              <th style={{ padding: "12px 10px", fontWeight: 500 }}>Category / Desc</th>
              <th style={{ padding: "12px 10px", fontWeight: 500 }}>Date</th>
              <th style={{ padding: "12px 10px", fontWeight: 500 }}>Amount & Status</th>
              <th style={{ padding: "12px 10px", fontWeight: 500 }}></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, idx) => (
              <tr key={exp._id} style={{ borderBottom: idx === expenses.length - 1 ? "none" : `1px solid ${C.cardBorder}`, transition: "background 0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,0.02)"} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                <td style={{ padding: "12px 10px" }}>
                  <div style={{ fontWeight: 600, color: C.text }}>{exp.category}</div>
                  <div style={{ color: C.textMuted, fontSize: "0.8rem", marginTop: 2 }}>{exp.description}</div>
                </td>
                <td style={{ padding: "12px 10px", color: C.textDim }}>
                  {new Date(exp.date || exp.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: "12px 10px" }}>
                  <div style={{ fontWeight: 600, color: C.text }}>{fmt(exp.amount)}</div>
                  <span style={{ 
                      display: "inline-block",
                      marginTop: 4,
                      padding: "2px 8px", 
                      borderRadius: 12, 
                      background: `${getStatusColor(exp.status)}1A`, 
                      color: getStatusColor(exp.status),
                      fontSize: "0.75rem",
                      fontWeight: 700
                  }}>
                    {exp.status}
                  </span>
                </td>
                <td style={{ padding: "12px 10px", whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => onEdit && onEdit(exp)}
                    style={{ background: "transparent", border: "none", color: C.info, cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, marginRight: 10 }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Delete this expense?")) onDelete && onDelete(exp._id);
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