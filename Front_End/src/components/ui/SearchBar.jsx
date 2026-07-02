import React from 'react';
import Icon from './Icon';
import { C } from "../../theme/colors";

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => (
  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
    <Icon 
      name="search" 
      size={16} 
      color={C.textDim} 
      style={{ position: "absolute", left: 11, pointerEvents: "none" }}
    />
    <input 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      placeholder={placeholder}
      style={{
        background: C.card,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 8,
        padding: "8px 12px 8px 34px",
        color: C.text,
        fontSize: "0.85rem",
        width: 220
      }}
      onFocus={e => e.target.style.borderColor = C.accent} 
      onBlur={e => e.target.style.borderColor = C.cardBorder}
    />
  </div>
);

export default SearchBar;
