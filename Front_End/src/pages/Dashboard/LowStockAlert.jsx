import React from 'react';
import Card from '../../components/ui/Card';
import { C } from '../../theme/colors';

const LowStockAlert = ({ items, onViewAll }) => (
  <Card>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, color: C.text, }}>
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem" }}>⚠ Low Stock Alerts</h3>
      {onViewAll && items.length > 0 && (
        <span
          onClick={onViewAll}
          style={{ fontSize: "0.72rem", color: C.accent, cursor: "pointer" }}
        >
          View all →
        </span>
      )}
    </div>
    {items.length === 0 ? (
      <p style={{ color: C.textMuted, fontSize: "0.85rem" }}>All items well-stocked!</p>
    ) : (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map(i => (
          <div
            key={i.id}
            onClick={onViewAll}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 10px",
              background: "#f59e0b10",
              border: "1px solid #f59e0b30",
              borderRadius: 8,
              cursor: onViewAll ? "pointer" : "default",
            }}
          >
            <div>
              <p style={{ fontSize: "0.82rem", fontWeight: 600, color: C.text }}>{i.name}</p>
              <p style={{ fontSize: "0.72rem", color: C.textMuted }}>{i.category}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.88rem", fontWeight: 700, color: C.warning }}>{i.stock}</p>
              <p style={{ fontSize: "0.7rem", color: C.textDim }}>min {i.minStock}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </Card>
);

export default LowStockAlert;