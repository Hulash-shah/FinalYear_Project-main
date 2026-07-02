import React from 'react';
import Card from '../../components/ui/Card';
import AvatarBubble from '../../components/ui/AvatarBubble';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { C } from '../../theme/colors';

const ProfileSection = ({ user, form, setForm }) => (
  <Card>
    <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 20 , color: C.text, }}>Profile Information</h3>
    <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 20 }}>
      <AvatarBubble initials={user.name.split(" ").map(n => n[0]).join("").slice(0,2)} size={64}/>
      <div>
        <p style={{ fontWeight: 600, marginBottom: 2 ,color: C.text }}>{user.name}</p>
        <p style={{ fontSize: "0.82rem", color: C.textMuted }}>{user.email}</p>
        <p style={{ fontSize: "0.78rem", color: C.textDim, marginTop: 2 }}>{user.role}</p>
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 , color: C.text }}>
      <Input label="Full Name" value={form.name} onChange={v => setForm({ ...form, name: v })}/>
      <Input label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })}  type="email"/>
      <Input label="Company" value={form.company} onChange={v => setForm({ ...form, company: v })}/>
      <Select label="Role" value={form.role} onChange={v => setForm({ ...form, role: v })} options={["Admin", "Manager", "Employee", "Viewer"]}/>
    </div>
  </Card>
);

export default ProfileSection;
