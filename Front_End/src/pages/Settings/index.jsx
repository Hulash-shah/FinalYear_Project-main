import React, { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Icon from '../../components/ui/Icon';
import Btn from '../../components/ui/Btn';
import ProfileSection from './ProfileSection';
// import PreferencesSection from './PreferencesSection';
import { C } from '../../theme/colors';

export default function SettingsPage({ user, setUser }) {
  const [form, setForm] = useState({
    name: user.name, 
    email: user.email, 
    company: user.company || "", 
    role: user.role || "", 
    notifications: true, 
    theme: "dark", 
    language: "English"
  });
  const [saved, setSaved] = useState(false);

  const save = () => {
    setUser({ ...user, ...form });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page-content" style={{ padding: "28px", overflowY: "auto", flex: 1 }}>
     <h1
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "2rem",
          color: C.text,
          margin: "0 0 8px 0",
        
        }}
      >
        Settings
      </h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            ["Profile", "user"],
            // ["Security", "settings"],
            // ["Notifications", "bell"],
            // ["Appearance", "eye"]
          ].map(([l, ic]) => (
            <button 
              key={l} 
              style={{
                display: "flex", 
                gap: 10, 
                alignItems: "center", 
                padding: "10px 14px", 
                borderRadius: 9, 
                border: "none", 
                cursor: "pointer", 
                background: l === "Profile" ? C.accentDim : "transparent", 
                color: l === "Profile" ? C.accent : C.textMuted, 
                fontFamily: "'DM Sans', sans-serif", 
                fontWeight: 600, 
                fontSize: "0.85rem", 
                textAlign: "left"
              }}
            >
              <Icon name={ic} size={16}/>{l}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <ProfileSection user={user} form={form} setForm={setForm} />
          {/* <PreferencesSection form={form} setForm={setForm} /> */}
          
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", alignItems: "center" }}>
            {saved && (
              <div style={{ display: "flex", gap: 6, alignItems: "center", color: C.success, fontSize: "0.85rem" }}>
                <Icon name="check" size={16} color={C.success}/>
                Saved!
              </div>
            )}
            <Btn label="Save Changes" icon="check" onClick={save}/>
          </div>
        </div>
      </div>
    </div>
  );
}
