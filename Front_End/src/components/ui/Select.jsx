import React from 'react';
import { C } from "../../theme/colors";

const Select = ({ label, value, onChange, options, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5, ...style }}>
    {label && <label style={{ fontSize: "0.78rem", fontWeight: 500, color: C.textMuted }}>{label}</label>}
    <select 
      value={value} 
      onChange={e => onChange(e.target.value)}
      style={{
        background: C.inputBg || C.card,
        border: `1.5px solid ${C.cardBorder}`,
        borderRadius: 8,
        padding: "9px 13px",
        color: C.text,
        fontSize: "0.88rem",
        appearance: "none",
        cursor: "pointer"
      }}
    >
      {options.map(o => (
        <option key={o.value || o} value={o.value || o}>
          {o.label || o}
        </option>
      ))}
    </select>
  </div>
);

export default Select;