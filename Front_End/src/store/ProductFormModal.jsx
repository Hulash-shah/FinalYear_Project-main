import React, { useState, useEffect } from 'react';
import { C } from '../theme/colors';

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 8,
  border: `1px solid ${C.cardBorder}`,
  background: "rgba(255,255,255,0.03)",
  color: C.text,
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  marginBottom: 6,
  color: C.textMuted,
  fontSize: "0.85rem",
  fontWeight: 500,
};

const fieldWrap = { marginBottom: 16 };

export default function ProductFormModal({ category, initialItem, extraFields = [], onSave, onClose }) {
  const isEdit = Boolean(initialItem);

  const [form, setForm] = useState({
    name: '',
    brand: '',
    size: '',
    price: '',
    stock: '',
    description: '',
    image: '',
    attributes: {},
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialItem) {
      setForm({
        name: initialItem.name || '',
        brand: initialItem.brand || '',
        size: initialItem.size || '',
        price: initialItem.price ?? '',
        stock: initialItem.stock ?? '',
        description: initialItem.description || '',
        image: initialItem.image || '',
        attributes: initialItem.attributes || {},
      });
    }
  }, [initialItem]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleAttributeChange = (key, value) => {
    setForm(prev => ({ ...prev, attributes: { ...prev.attributes, [key]: value } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.price) {
      setError('Name and Price are required.');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...form,
        category,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: C.card, borderRadius: 16, border: `1px solid ${C.cardBorder}`,
          padding: 28, width: 440, maxHeight: "85vh", overflowY: "auto",
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ margin: "0 0 4px 0", color: C.text, fontSize: "1.2rem", fontFamily: "'Syne', sans-serif" }}>
          {isEdit ? 'Edit Item' : 'Add New Item'}
        </h2>
        <p style={{ margin: "0 0 24px 0", color: C.textMuted, fontSize: "0.85rem" }}>
          Category: <strong style={{ color: C.text }}>{category}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div style={fieldWrap}>
            <label style={labelStyle}>Item Name *</label>
            <input style={{ ...inputStyle, color: C.text }} value={form.name} onChange={e => handleChange('name', e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Brand</label>
              <input style={{ ...inputStyle, color: C.text }} value={form.brand} onChange={e => handleChange('brand', e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Size</label>
              <input style={{ ...inputStyle, color: C.text }} value={form.size} onChange={e => handleChange('size', e.target.value)} placeholder="e.g. M, 10 US" />
            </div>
          </div>

          {extraFields.map(field => (
            <div style={fieldWrap} key={field.key}>
              <label style={labelStyle}>{field.label}</label>
              <input
                style={{ ...inputStyle, color: C.text }}
                value={form.attributes[field.key] || ''}
                onChange={e => handleAttributeChange(field.key, e.target.value)}
                placeholder={field.placeholder || ''}
              />
            </div>
          ))}

          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Price *</label>
              <input style={{ ...inputStyle, color: C.text }} type="number" step="0.01" min="0" value={form.price} onChange={e => handleChange('price', e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Stock</label>
              <input style={{ ...inputStyle, color: C.text }} type="number" min="0" value={form.stock} onChange={e => handleChange('stock', e.target.value)} />
            </div>
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Image URL</label>
            <input style={{ ...inputStyle, color: C.text }} value={form.image} onChange={e => handleChange('image', e.target.value)} placeholder="https://..." />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, minHeight: 70, resize: "vertical", fontFamily: "inherit" }}
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
            />
          </div>

          {error && (
            <p style={{ color: C.danger, fontSize: "0.85rem", margin: "0 0 16px 0" }}>{error}</p>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "transparent", border: `1px solid ${C.cardBorder}`, color: C.text,
                padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontWeight: 500,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: C.accent, color: "#000", border: "none",
                padding: "10px 20px", borderRadius: 8, fontWeight: 600,
                cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}