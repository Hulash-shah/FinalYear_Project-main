import React, { useState, useEffect, useCallback } from 'react';
import { C } from '../theme/colors';
import CategoryInventory from './CategoryInventory';

const API_BASE = 'https://finalyear-project-main.onrender.com/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function StoreInventory() {
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success) {
        // Fall back to the three defaults if the DB is empty so the page
        // isn't blank on a fresh install.
        const cats = data.data.length > 0 ? data.data : ['Shoes', 'Clothing', 'Sports Gear'];
        setCategories(cats);
        setActiveTab(prev => prev || cats[0]);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
      setCategories(['Shoes', 'Clothing', 'Sports Gear']);
      setActiveTab('Shoes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = (e) => {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name) return;

    if (!categories.some(c => c.toLowerCase() === name.toLowerCase())) {
      setCategories(prev => [...prev, name]);
    }
    setActiveTab(name);
    setNewCategoryName('');
    setAddingCategory(false);
  };

  const handleDeleteCategory = async (cat) => {
    setDeleteError('');
    setDeletingCategory(cat);
    try {
      const res = await fetch(`${API_BASE}/products?category=${encodeURIComponent(cat)}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Could not check category.');

      if (data.data.length > 0) {
        setDeleteError(
          `"${cat}" still has ${data.data.length} item${data.data.length === 1 ? '' : 's'}. Delete or move them before removing this category.`
        );
        return;
      }

      setCategories(prev => prev.filter(c => c !== cat));
      if (activeTab === cat) {
        const remaining = categories.filter(c => c !== cat);
        setActiveTab(remaining[0] || null);
      }
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeletingCategory(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "32px 40px", color: C.textMuted }}>
        Loading store...
      </div>
    );
  }

  return (
    <div style={{ padding: "32px 40px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", color: C.text, margin: "0 0 8px 0" }}>Store Inventory</h1>
        <p style={{ color: C.textMuted, margin: 0, fontSize: "1rem" }}>Manage inventory across all your store categories.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 16, marginBottom: deleteError ? 12 : 32, borderBottom: `1px solid ${C.cardBorder}`, paddingBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
        {categories.map(cat => (
          <div
            key={cat}
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: activeTab === cat ? C.accent : "transparent",
              background: activeTab === cat ? C.accentDim : "transparent",
              opacity: deletingCategory === cat ? 0.5 : 1,
            }}
          >
            <button
              onClick={() => setActiveTab(cat)}
              style={{
                padding: "10px 8px 10px 24px",
                border: "none",
                background: "transparent",
                color: activeTab === cat ? C.accent : C.text,
                fontSize: "0.95rem",
                fontWeight: activeTab === cat ? 600 : 500,
                cursor: "pointer",
              }}
            >
              {cat}
            </button>
            <button
              onClick={() => handleDeleteCategory(cat)}
              disabled={deletingCategory === cat}
              title={`Remove ${cat} category`}
              style={{
                padding: "10px 16px 10px 4px",
                border: "none",
                background: "transparent",
                color: C.textMuted,
                fontSize: "0.9rem",
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        ))}

        {addingCategory ? (
          <form onSubmit={handleAddCategory} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              autoFocus
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: `1px solid ${C.cardBorder}`,
                background: "rgba(255,255,255,0.03)",
                color: C.text,
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{ background: C.accent, color: "#000", border: "none", padding: "8px 16px", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => { setAddingCategory(false); setNewCategoryName(''); }}
              style={{ background: "transparent", color: C.textMuted, border: "none", cursor: "pointer", fontSize: "0.85rem" }}
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setAddingCategory(true)}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: `1px dashed ${C.cardBorder}`,
              background: "transparent",
              color: C.textMuted,
              fontSize: "0.9rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            + New Category
          </button>
        )}
      </div>

      {deleteError && (
        <p style={{ color: C.danger, fontSize: "0.85rem", margin: "0 0 20px 0" }}>{deleteError}</p>
      )}

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {activeTab && <CategoryInventory category={activeTab} />}
      </div>
    </div>
  );
}