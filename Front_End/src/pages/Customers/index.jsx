import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import { Table, TD } from '../../components/ui/Table';
import SearchBar from '../../components/ui/SearchBar';
import AvatarBubble from '../../components/ui/AvatarBubble';
import Badge from '../../components/ui/Badge';
import Btn from '../../components/ui/Btn';
import CustomerModal from './CustomerModal';
import { C } from '../../theme/colors';
import { customerAPI } from '../../api/customerAPI';

const EMPTY_FORM = {
  name: '', email: '', phone: '', company: '', address: '',
  status: 'Lead', notes: '',
};

function statusColor(status) {
  switch (status) {
    case 'Active':   return C.success;
    case 'VIP':      return C.accent;
    case 'Lead':     return C.info;
    case 'Inactive': return C.textMuted;
    default:         return C.textMuted;
  }
}

function initials(name = '') {
  return name.split(' ').map(w => w.charAt(0)).join('').slice(0, 2).toUpperCase();
}

export default function CustomersPage({  setData }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [saving, setSaving]       = useState(false);
  const [search, setSearch]       = useState('');
  const [modal, setModal]         = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      const result = await customerAPI.getAll(params);
      setCustomers(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchCustomers, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [fetchCustomers, search]);

  // Keep shared dashboard data in sync, same pattern as EmployeesPage
  useEffect(() => {
    if (setData) {
      setData(prev => ({ ...prev, customers }));
    }
  }, [customers, setData]);

  const stats = {
    total:    customers.length,
    active:   customers.filter(c => c.status === 'Active').length,
    leads:    customers.filter(c => c.status === 'Lead').length,
    vip:      customers.filter(c => c.status === 'VIP').length,
  };

  const openAdd  = () => { setForm(EMPTY_FORM); setFormError(''); setModal('add'); };
  const openEdit = (cust) => { setForm({ ...cust }); setFormError(''); setModal('edit'); };

  const save = async () => {
    setFormError('');
    if (!form.name || !form.email) {
      setFormError('Name and email are required.');
      return;
    }
    setSaving(true);
    try {
      if (modal === 'add') {
        await customerAPI.create(form);
      } else {
        await customerAPI.update(form._id, form);
      }
      setModal(null);
      fetchCustomers();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Remove this customer?')) return;
    try {
      await customerAPI.remove(id);
      setCustomers(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page-content" style={{ padding: '28px', overflowY: 'auto', flex: 1 }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", color: C.text, margin: "0 0 8px 0" }}>Customers</h1>
      <PageHeader
       
        subtitle={`${stats.total} total customers`}
        action={<Btn label="Add Customer" icon="plus" onClick={openAdd} />}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          ['Total',  stats.total,  C.accent],
          ['Active', stats.active, C.success],
          ['Leads',  stats.leads,  C.info],
          ['VIP',    stats.vip,    C.warning],
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
          <SearchBar value={search} onChange={setSearch} placeholder="Search customers..." />
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: 40, color: C.textMuted }}>Loading customers…</p>
        ) : customers.length === 0 ? (
          <p style={{ textAlign: 'center', padding: 40, color: C.textMuted }}>No customers found.</p>
        ) : (
          <Table
            columns={['Name', 'Email', 'Phone', 'Status', 'Total Spent', 'Invoices', 'Last Purchase', 'Actions']}
            data={customers}
            renderRow={cust => (
              <>
                <TD>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <AvatarBubble initials={initials(cust.name)} size={34} />
                    <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>{cust.name}</p>
                  </div>
                </TD>
                <TD style={{ color: C.textMuted }}>{cust.email}</TD>
                <TD style={{ color: C.textMuted }}>{cust.phone || '—'}</TD>
                <TD><Badge label={cust.status} color={statusColor(cust.status)} /></TD>
                <TD style={{ color: C.text, fontWeight: 600 }}>
                  {cust.totalSpent ? `₹${cust.totalSpent.toLocaleString()}` : '—'}
                </TD>
                <TD style={{ color: C.textMuted }}>{cust.invoiceCount || 0}</TD>
                <TD style={{ color: C.textMuted }}>
                  {cust.lastPurchase ? new Date(cust.lastPurchase).toLocaleDateString() : '—'}
                </TD>
                <TD>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Btn label="Edit" icon="edit" variant="ghost" size="sm" onClick={() => openEdit(cust)} />
                    <Btn label="" icon="trash" variant="danger" size="sm" onClick={() => remove(cust._id)} />
                  </div>
                </TD>
              </>
            )}
          />
        )}
      </Card>

      {modal && (
        <CustomerModal
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