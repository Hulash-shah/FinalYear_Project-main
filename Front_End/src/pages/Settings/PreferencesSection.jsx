import React from 'react';
import Card from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import { C } from '../../theme/colors';

const PreferencesSection = ({ form, setForm }) => (
  <Card>
    {/* <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 20 }}>Preferences</h3> */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {/* <Select 
        label="Language" 
        value={form.language} 
        onChange={v => setForm({ ...form, language: v })} 
        options={["English", "Spanish", "French", "German"]}
      /> */}
      {/* <Select 
        label="Theme" 
        value={form.theme} 
        onChange={v => setForm({ ...form, theme: v })} 
        options={["dark", "light"]}
      /> */}
      <div 
        style={{
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          gridColumn: "1/-1", 
          padding: "12px 14px", 
          background: "#111", 
          borderRadius: 9
        }}
      >
        {/* <div>
          <p style={{ fontWeight: 500, fontSize: "0.88rem" }}>Email Notifications</p>
          <p style={{ fontSize: "0.76rem", color: C.textMuted, marginTop: 2 }}>Receive alerts for invoices, tasks & reports</p>
        </div> */}
        <div 
          onClick={() => setForm({ ...form, notifications: !form.notifications })} 
          style={{
            width: 44, 
            height: 24, 
            borderRadius: 12, 
            background: form.notifications ? C.accent : "#333", 
            cursor: "pointer", 
            position: "relative", 
            transition: "background 0.2s"
          }}
        >
          <div 
            style={{
              position: "absolute", 
              top: 3, 
              left: form.notifications ? 22 : 3, 
              width: 18, 
              height: 18, 
              borderRadius: "50%", 
              background: form.notifications ? "#0a0a0a" : "#666", 
              transition: "left 0.2s"
            }}
          />
        </div>
      </div>
    </div>
  </Card>
);

export default PreferencesSection;
