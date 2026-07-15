import React from 'react';
import Card from '../../components/ui/Card';
import { C } from '../../theme/colors';
import { fmt } from '../../utils/formatters';

export default function PurchasesList({ purchases, onEdit, onDelete }) {
  return (
    <Card style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.05rem", margin: 0, color: C.text, }}>Recent Purchases</h3>
        {/* <button style={{ background: "transparent", color: C.info, border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
          View All
        </button> */}
      </div>

      <div style={{ overflowY: "auto", flex: 1 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", color: C.text, fontSize: "0.85rem", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.cardBorder}`, color: C.textMuted }}>
              <th style={{ padding: "12px 10px", fontWeight: 500 }}>PO # / Supplier</th>
              <th style={{ padding: "12px 10px", fontWeight: 500 }}>Date</th>
              <th style={{ padding: "12px 10px", fontWeight: 500 }}>Items & Cost</th>
              <th style={{ padding: "12px 10px", fontWeight: 500 }}></th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p, idx) => (
              <tr key={p._id} style={{ borderBottom: idx === purchases.length - 1 ? "none" : `1px solid ${C.cardBorder}`, transition: "background 0.2s" }}
               onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,0.02)"} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                <td style={{ padding: "12px 10px" }}>
                  <div style={{ fontWeight: 600, color: C.text }}>{p.purchaseNumber}</div>
                  <div style={{ color: C.textMuted, fontSize: "0.8rem", marginTop: 2 }}>{p.supplier}</div>
                </td>
                <td style={{ padding: "12px 10px", color: C.textDim }}>
                  {new Date(p.date || p.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: "12px 10px" }}>
                  <div style={{ fontWeight: 600, color: C.text }}>{fmt(p.totalCost)}</div>
                  <div style={{ color: C.textMuted, fontSize: "0.78rem", marginTop: 2 }}>
                    {p.items?.length || 0} item{p.items?.length === 1 ? "" : "s"}
                  </div>
                </td>
                <td style={{ padding: "12px 10px", whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => onEdit && onEdit(p)}
                    style={{ background: "transparent", border: "none", color: C.info, cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, marginRight: 10 }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Delete this purchase? Stock added by it will be reversed.")) onDelete && onDelete(p._id);
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