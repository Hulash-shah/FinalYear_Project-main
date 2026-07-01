import { useState, useEffect } from 'react';
import { employeeAPI } from '../api/employeeAPI';

// No more mock data — the app starts empty and fills in entirely from
// real API calls below. These empty arrays just prevent crashes (e.g.
// `data.invoices.filter(...)`) in the brief moment before each fetch
// resolves.
const EMPTY_DATA = {
  employees: [],
  customers: [],
  invoices: [],
  expenses: [],
  inventory: [],
};

const API_BASE = "http://localhost:5000/api";

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

export function useAppData() {
  const [data, setData] = useState(EMPTY_DATA);

  useEffect(() => {
    async function loadEmployees() {
      try {
        const employees = await employeeAPI.getAll({});
        setData(prev => ({ ...prev, employees }));
      } catch (err) {
        console.error("Failed to load employees:", err);
      }
    }

    async function loadInvoices() {
      try {
        const res = await fetch(`${API_BASE}/invoices`, { headers: authHeaders() });
        const result = await res.json();
        if (result.success) {
          setData(prev => ({ ...prev, invoices: result.data }));
        }
      } catch (err) {
        console.error("Failed to load invoices:", err);
      }
    }

    async function loadExpenses() {
      try {
        const res = await fetch(`${API_BASE}/expenses`, { headers: authHeaders() });
        const result = await res.json();
        if (result.success) {
          setData(prev => ({ ...prev, expenses: result.data }));
        }
      } catch (err) {
        console.error("Failed to load expenses:", err);
      }
    }

    async function loadProducts() {
      try {
        const res = await fetch(`${API_BASE}/products`, { headers: authHeaders() });
        const result = await res.json();
        if (result.success) {
          // LowStockAlert expects { id, name, category, stock, minStock }.
          // The Product model doesn't store a per-product minStock, it just
          // flags status "Low Stock" once stock < 10 (see products.js), so
          // we reuse that same threshold here for the "min" display.
          const inventory = result.data.map(p => ({
            id: p._id,
            name: p.name,
            category: p.category,
            stock: p.stock,
            minStock: 10,
          }));
          setData(prev => ({ ...prev, inventory }));
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    }

    loadEmployees();
    loadInvoices();
    loadExpenses();
    loadProducts();
  }, []);

  return { data, setData };
}