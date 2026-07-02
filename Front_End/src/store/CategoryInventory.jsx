import React, { useState, useEffect, useCallback } from 'react';
import InventoryTable from './InventoryTable';
import { C } from '../theme/colors';

const API_BASE = 'http://localhost:5000/api/products';

const CATEGORY_EXTRA_FIELDS = {
  Shoes: [],
  Clothing: [],
  'Sports Gear': [
    { key: 'sport', label: 'Sport Type', placeholder: 'e.g. Tennis' },
    { key: 'condition', label: 'Condition', placeholder: 'e.g. New' },
  ],
};

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function CategoryInventory({ category }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ category });
      if (search) params.set('search', search);

      const res = await fetch(`${API_BASE}?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to load items');
      setItems(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems();
    }, 300); // debounce so it doesn't fire on every keystroke
    return () => clearTimeout(timer);
  }, [fetchItems]);

  const handleAdd = async (formData) => {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to add item');
    setItems(prev => [data.data, ...prev]);
  };

  const handleEdit = async (id, formData) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to update item');
    setItems(prev => prev.map(it => (it._id === id ? data.data : it)));
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to delete item');
      setItems(prev => prev.filter(it => it._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const extraFields = CATEGORY_EXTRA_FIELDS[category] || [];

  const columns = [
    { key: 'name', label: 'Item Name', render: val => <span style={{ fontWeight: 600 }}>{val}</span> },
    { key: 'brand', label: 'Brand' },
    { key: 'size', label: 'Size' },
    ...extraFields.map(f => ({
      key: f.key,
      label: f.label,
      render: (_val, item) => (item.attributes && item.attributes[f.key]) || '—',
    })),
    {
      key: 'stock',
      label: 'Stock Level',
      render: val => (
        <span style={{
          padding: "4px 10px",
          borderRadius: 20,
          background: val < 10 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
          color: val < 10 ? C.danger : C.success,
          fontSize: "0.85rem",
          fontWeight: 600
        }}>
          {val} in stock
        </span>
      )
    },
    { key: 'price', label: 'Price', render: val => `₹${Number(val).toFixed(2)}` },
  ];

  if (loading && items.length === 0) {
    return <div style={{ color: C.textMuted, padding: 40 }}>Loading {category} inventory...</div>;
  }

  if (error) {
    return <div style={{ color: C.danger, padding: 40 }}>Error: {error}</div>;
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: 16 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${category.toLowerCase()} by name or brand...`}
          style={{
            width: "100%",
            maxWidth: 360,
            padding: "10px 14px",
            borderRadius: 8,
            border: `1px solid ${C.cardBorder}`,
            background: C.inputBg || C.card,
            color: C.text,
            fontSize: "0.9rem",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>
      <InventoryTable
        title={`${category} Inventory`}
        description={`Manage stock and product details for ${category.toLowerCase()}.`}
        items={items}
        columns={columns}
        category={category}
        extraFields={extraFields}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}