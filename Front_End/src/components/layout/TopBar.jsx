import React from 'react';
import Icon from '../ui/Icon';
import AvatarBubble from '../ui/AvatarBubble';
import { C } from "../../theme/colors";
import { NAV } from "../../data/constants";


function TopBar({ page, user, isDark, toggleTheme, setActivePage }) {
  const title = NAV.find(n => n.id === page)?.label || page;

  return (
    <div
      style={{
        height: 58,
        background: C.sidebar,
        borderBottom: `1px solid ${C.cardBorder}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        flexShrink: 0
      }}
    >
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.05rem", color: C.text }}>{title}</h2>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>

        {/* THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.3s ease",
            transform: isDark ? "rotate(0deg)" : "rotate(180deg)",
          }}
        >
          <LampIcon isOn={!isDark} color={C.textMuted} accent={C.accent} />
        </button>

        <div style={{ position: "relative" }}>
          <button style={{ background: "none", border: "none", color: C.textMuted, display: "flex", position: "relative" }}>
            <Icon name="bell" size={20}/>
            <span
              style={{
                position: "absolute",
                top: -2,
                right: -2,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: C.danger,
                border: `2px solid ${C.sidebar}`
              }}
            />
          </button>
        </div>
        <div
          onClick={() => setActivePage('settings')}
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        >
          <AvatarBubble initials={user.name.split(" ").map(n => n[0]).join("").slice(0,2)} size={32}/>
          <div style={{ lineHeight: 1.3 }}>
            <p style={{ fontSize: "0.82rem", fontWeight: 600, color: C.text }}>{user.name}</p>
            <p style={{ fontSize: "0.72rem", color: C.textMuted }}>{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LampIcon({ isOn, color, accent }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2a7 7 0 0 0-4 12.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26A7 7 0 0 0 12 2Z"
        stroke={isOn ? accent : color}
        strokeWidth="1.6"
        fill={isOn ? accent : "none"}
        fillOpacity={isOn ? 0.18 : 0}
      />
      <line x1="9" y1="21" x2="15" y2="21" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="10" y1="19" x2="14" y2="19" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default TopBar;