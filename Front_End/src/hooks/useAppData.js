import { useState, useEffect } from "react";
import { employeeAPI } from "../api/employeeAPI";

const EMPTY_DATA = {
  employees: [],
  customers: [],
  invoices: [],
  expenses: [],
  purchases: [],
  inventory: [],
};

const API_BASE = "https://finalyear-project-main.onrender.com/api";

function authHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);

  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  console.log("API URL:", url);
  console.log("API Status:", response.status);
  console.log("API Content-Type:", contentType);
  console.log("API Response:", text);

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}\n${text}`
    );
  }

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Expected JSON but received ${contentType || "unknown content type"}\n${text}`
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON response:\n${text}`);
  }
}

export function useAppData() {
  const [data, setData] = useState(EMPTY_DATA);

  useEffect(() => {
    async function loadEmployees() {
      try {
        const employees = await employeeAPI.getAll({});
        setData((prev) => ({
          ...prev,
          employees,
        }));
      } catch (err) {
        console.error("Failed to load employees:", err);
      }
    }

    async function loadInvoices() {
      try {
        const result = await fetchJSON(`${API_BASE}/invoices`, {
          headers: authHeaders(),
        });

        if (result.success) {
          setData((prev) => ({
            ...prev,
            invoices: result.data || [],
          }));
        } else {
          console.error("Invoice API returned unsuccessful response:", result);
        }
      } catch (err) {
        console.error("Failed to load invoices:", err);
      }
    }

    async function loadExpenses() {
      try {
        const result = await fetchJSON(`${API_BASE}/expenses`, {
          headers: authHeaders(),
        });

        if (result.success) {
          setData((prev) => ({
            ...prev,
            expenses: result.data || [],
          }));
        } else {
          console.error("Expense API returned unsuccessful response:", result);
        }
      } catch (err) {
        console.error("Failed to load expenses:", err);
      }
    }

    async function loadPurchases() {
      try {
        const result = await fetchJSON(`${API_BASE}/purchases`, {
          headers: authHeaders(),
        });

        if (result.success) {
          setData((prev) => ({
            ...prev,
            purchases: result.data || [],
          }));
        } else {
          console.error(
            "Purchase API returned unsuccessful response:",
            result
          );
        }
      } catch (err) {
        console.error("Failed to load purchases:", err);
      }
    }

    async function loadProducts() {
      try {
        const url = `${API_BASE}/products`;

        console.log("--------------------------------");
        console.log("Loading products...");
        console.log("Products URL:", url);
        console.log("Token exists:", !!localStorage.getItem("token"));

        const result = await fetchJSON(url, {
          headers: authHeaders(),
        });

        console.log("Products parsed result:", result);

        if (result.success) {
          const products = result.data || [];

          const inventory = products.map((p) => ({
            id: p._id,
            name: p.name,
            category: p.category,
            stock: p.stock,
            minStock: p.minStock || 10,
          }));

          setData((prev) => ({
            ...prev,
            inventory,
          }));
        } else {
          console.error(
            "Products API returned unsuccessful response:",
            result
          );
        }

        console.log("--------------------------------");
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    }

    loadEmployees();
    loadInvoices();
    loadExpenses();
    loadPurchases();
    loadProducts();
  }, []);

  return {
    data,
    setData,
  };
}