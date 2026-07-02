import React from 'react';
import { C } from "../../theme/colors";

const Input = ({ label, value, onChange, type = "text", placeholder = "", error = "", style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5, ...style }}>
    {label && <label style={{ fontSize: "0.78rem", fontWeight: 500, color: C.textMuted }}>{label}</label>}
    <input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      placeholder={placeholder}
      style={{
        background: C.inputBg || C.card,
        border: `1.5px solid ${error ? C.danger : C.cardBorder}`,
        borderRadius: 8,
        padding: "9px 13px",
        color: C.text,
        fontSize: "0.88rem",
        transition: "border-color 0.2s"
      }}
      onFocus={e => e.target.style.borderColor = C.accent} 
      onBlur={e => e.target.style.borderColor = error ? C.danger : C.cardBorder}
    />
    {error && <span style={{ fontSize: "0.73rem", color: C.danger }}>{error}</span>}
  </div>
);

export default Input;