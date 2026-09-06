import React, { useState } from 'react';
import { C } from '../../theme/colors';
import { GlobalStyle } from '../../theme/globalStyles';
import Icon from '../../components/ui/Icon';
import Input from '../../components/ui/Input';
import signinImage from "../../../images/signin.jpeg";

export default function LoginPage({ onLogin, onNavigate, isDark, toggleTheme }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("https://finalyear-project-main.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        
        localStorage.setItem("token", data.token);
        onLogin(data.user);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Cannot reach server");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div
  style={{
    minHeight: "100vh",
    display: "flex",
    fontFamily: "'DM Sans', sans-serif",

    backgroundImage: `
      linear-gradient(
        rgba(8,12,20,0.75),
        rgba(8,12,20,0.75)
      ),
      url(${signinImage})
    `,

    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
  }}
>
      <GlobalStyle />
      

      {/* <div
        style={{
          width: "45%",
          background: "#111",
          display: "flex",
          flexDirection: "column",
          padding: "48px 44px",
          borderRight: "1px solid #1e1e1e"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 64 }}>
          <svg width="38" height="38" viewBox="0 0 44 44" fill="none">
            <rect width="44" height="44" rx="10" fill={C.accent}/>
            <rect x="10" y="10" width="10" height="10" rx="2" fill="#0a0a0a"/>
            <rect x="24" y="10" width="10" height="10" rx="2" fill="#0a0a0a"/>
            <rect x="10" y="24" width="10" height="10" rx="2" fill="#0a0a0a"/>
            <rect x="24" y="24" width="10" height="10" rx="2" fill="#0a0a0a" opacity="0.4"/>
          </svg>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#fff" }}>
            BizCore
          </span>
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2.4rem", color: "#fff" }}>
            Experience the power of one dashboard to run the entire business.
          </h2>
          <p style={{ color: "#999", fontSize: "0.95rem", marginTop: 18 }}>
            One platform for HR, Finance, Inventory, Projects, CRM, and more.
          </p>
        </div>

        <p style={{ color: "#555", fontSize: "0.75rem" }}>
          © 2024 BizCore. All rights reserved.
        </p>
      </div> */}

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, position: "relative" }}>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            position: "absolute", top: 28, right: 32,
            background: "transparent", border: "none", cursor: "pointer",
            padding: 8, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.3s ease",
            transform: isDark ? "rotate(0deg)" : "rotate(180deg)",
          }}
        >
          <LampIcon isOn={!isDark} color={C.text} accent={C.accent} />
        </button>

        <div style={{ width: "100%", maxWidth: 400 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2rem", color: "0f0f0f" }}>
            Sign in
          </h2>
          <p style={{ color: "0f0f0f", marginBottom: 32 }}>
           Experience the power of one dashboard to run the entire business.
          </p>

          {error && (
            <div style={{ background: "#ef444418", padding: 10, borderRadius: 8, marginBottom: 16, color: "red" }}>
              <Icon name="warning" size={16} color="red" /> {error}
            </div>
          )}

          <Input label="Email" color="0f0f0f" value={form.email} onChange={v => setForm({ ...form, email: v })} type="email" placeholder="bizcore@gmail.com" />
          <Input label="Password" color="0f0f0f" value={form.password} onChange={v => setForm({ ...form, password: v })} type="password" placeholder="••••••••" />

          <button
            onClick={handleLogin}
            style={{
              width: "100%", padding: "12px", marginTop: 20,
              background: C.accent, border: "none", borderRadius: 10,
              fontWeight: 700, cursor: "pointer", color: "#fff",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <span style={{ color: C.textMuted }}>No account? </span>
            <button onClick={() => onNavigate("register")} style={{ background: "none", border: "none", color: C.accent, cursor: "pointer" }}>
              Create one
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LampIcon({ isOn, color, accent }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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