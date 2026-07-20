import React from 'react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Btn from '../../components/ui/Btn';

const EmployeeModal = ({ modal, onClose, form, setForm, save, saving, error }) => (
  <Modal
    title={modal === "add" ? "Add Employee" : "Edit Employee"}
    onClose={onClose}
  >
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <Input
        label="Full Name"
        value={form.name}
        onChange={v => setForm({ ...form, name: v })}
        style={{ gridColumn: "1/-1" }}
      />
      <Input
        label="Role / Title"
        value={form.role}
        onChange={v => setForm({ ...form, role: v })}
      />
      <Select
        label="Department"
        value={form.dept}
        onChange={v => setForm({ ...form, dept: v })}
        options={["Engineering", "Product", "Design", "Sales", "Finance", "HR", "Operations"]}
      />
      <Input
        label="Email"
        value={form.email}
        onChange={v => setForm({ ...form, email: v })}
        type="email"
      />
      <Input
        label="Phone"
        value={form.phone}
        onChange={v => setForm({ ...form, phone: v })}
      />
      <Input
        label="Salary"
        value={form.salary}
        onChange={v => setForm({ ...form, salary: v })}
        type="number"
      />
      <Select
        label="Status"
        value={form.status}
        onChange={v => setForm({ ...form, status: v })}
        options={["Active", "On Leave", "Inactive"]}
      />
      <Input
        label="Join Date"
        value={form.joined}
        onChange={v => setForm({ ...form, joined: v })}
        type="date"
        style={{ gridColumn: "1/-1" }}
      />
    </div>

    {error && (
      <p style={{ color: "#ff4444", fontSize: "0.8rem", marginTop: 12, marginBottom: 0 }}>
        ⚠ {error}
      </p>
    )}

    <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
      <Btn label="Cancel" variant="ghost" onClick={onClose} />
      <Btn
        label={saving ? "Saving..." : "Save Employee"}
        icon="check"
        onClick={save}
        disabled={saving}
      />
    </div>
  </Modal>
);

export default EmployeeModal;