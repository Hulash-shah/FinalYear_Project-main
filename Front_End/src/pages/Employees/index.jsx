import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import { Table, TD } from '../../components/ui/Table';
import SearchBar from '../../components/ui/SearchBar';
import AvatarBubble from '../../components/ui/AvatarBubble';
import Badge from '../../components/ui/Badge';
import Btn from '../../components/ui/Btn';
import EmployeeModal from './EmployeeModal';
import { fmt, statusColor } from '../../utils/formatters';
import { C } from '../../theme/colors';
import { employeeAPI } from '../../api/employeeAPI';

const EMPTY_FORM = {
  name: '', role: '', dept: 'Engineering', salary: '',
  status: 'Active', email: '', phone: '',
  joined: new Date().toISOString().split('T')[0],
};

export default function EmployeesPage({  setData }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [saving, setSaving]       = useState(false);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('All');
  const [modal, setModal]         = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search)           params.search = search;
      if (filter !== 'All') params.dept   = filter;
      const result = await employeeAPI.getAll(params);
      setEmployees(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  useEffect(() => {
    const t = setTimeout(fetchEmployees, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [fetchEmployees, search]);

  // 🔄 Keep shared dashboard data in sync whenever the employee list changes.
  // NOTE: this only mirrors the CURRENT filtered/searched view into shared
  // state. If search/filter is active, dashboard counts would reflect the
  // filtered subset, not all employees — see the note below this file.
  useEffect(() => {
    if (setData) {
      setData(prev => ({ ...prev, employees }));
    }
  }, [employees, setData]);

  const stats = {
    total:     employees.length,
    active:    employees.filter(e => e.status === 'Active').length,
    onLeave:   employees.filter(e => e.status === 'On Leave').length,
    avgSalary: employees.length
      ? employees.reduce((a, b) => a + b.salary, 0) / employees.length
      : 0,
  };

  const depts = ['All', ...new Set(employees.map(e => e.dept))];

  const openAdd  = () => { setForm(EMPTY_FORM); setFormError(''); setModal('add'); };
  const openEdit = (emp) => { setForm({ ...emp, salary: String(emp.salary) }); setFormError(''); setModal('edit'); };

  const save = async () => {
    setFormError('');
    if (!form.name || !form.role || !form.email || !form.salary) {
      setFormError('Name, role, email and salary are required.');
      return;
    }
    setSaving(true);
    try {
      if (modal === 'add') {
        await employeeAPI.create({ ...form, salary: Number(form.salary) });
      } else {
        await employeeAPI.update(form._id, { ...form, salary: Number(form.salary) });
      }
      setModal(null);
      fetchEmployees();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Remove this employee?')) return;
    try {
      await employeeAPI.remove(id);
      setEmployees(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page-content" style={{ padding: '28px', overflowY: 'auto', flex: 1 }}>
       <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", color: C.text, margin: "0 0 8px 0" }}>Employees</h1>
                  
           
      <PageHeader
        
        subtitle={`${stats.total} total team members`}
        action={<Btn label="Add Employee" icon="plus" onClick={openAdd} />}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          ['Total',      stats.total,          C.accent],
          ['Active',     stats.active,         C.success],
          ['On Leave',   stats.onLeave,        C.warning],
          ['Avg Salary', fmt(stats.avgSalary), C.info],
        ].map(([l, v, c], i) => (
          <Card key={i}>
            <p style={{ fontSize: '0.75rem', color: C.textMuted, marginBottom: 6 }}>{l}</p>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.5rem', color: c }}>{v}</p>
          </Card>
        ))}
      </div>

      {error && (
        <div style={{ background: '#ff000020', border: '1px solid #ff4444', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#ff4444', fontSize: '0.85rem' }}>
          ⚠ {error}
        </div>
      )}

      <Card>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search employees..." />
          <div style={{ display: 'flex', gap: 6 }}>
            {depts.map(d => (
              <button key={d} onClick={() => setFilter(d)} style={{
                padding: '6px 12px', borderRadius: 20,
                border: `1px solid ${filter === d ? C.accent : C.cardBorder}`,
                background: filter === d ? C.accentDim : 'transparent',
                color: filter === d ? C.accent : C.textMuted,
                fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: 40, color: C.textMuted }}>Loading employees…</p>
        ) : employees.length === 0 ? (
          <p style={{ textAlign: 'center', padding: 40, color: C.textMuted }}>No employees found.</p>
        ) : (
          <Table
            columns={['Employee', 'Department', 'Role', 'Salary', 'Status', 'Actions']}
            data={employees}
            renderRow={emp => (
              <>
                <TD>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <AvatarBubble initials={emp.avatar} size={34} />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.88rem', color: C.text}}>{emp.name}</p>
                      <p style={{ fontSize: '0.74rem', color: C.textMuted,  }}>{emp.email}</p>
                    </div>
                  </div>
                </TD>
                <TD><span style={{ background: '#ffffff10', padding: '3px 10px', borderRadius: 20, fontSize: '0.78rem', color: C.text }}>{emp.dept}</span></TD>
                <TD style={{ color: C.textMuted }}>{emp.role}</TD>
                <TD style={{ fontWeight: 600 , color: C.text }}>{fmt(emp.salary)}</TD>
                <TD><Badge label={emp.status} color={statusColor(emp.status)} /></TD>
                <TD>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Btn label="Edit" icon="edit" variant="ghost" size="sm" onClick={() => openEdit(emp)} />
                    <Btn label="" icon="trash" variant="danger" size="sm" onClick={() => remove(emp._id)} />
                  </div>
                </TD>
              </>
            )}
          />
        )}
      </Card>

      {modal && (
        <EmployeeModal
          modal={modal}
          onClose={() => setModal(null)}
          form={form}
          setForm={setForm}
          save={save}
          saving={saving}
          error={formError}
        />
      )}
    </div>
  );
}