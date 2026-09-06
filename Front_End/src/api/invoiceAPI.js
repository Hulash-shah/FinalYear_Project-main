const BASE = 'https://finalyear-project-main.onrender.com/';

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Request failed');
  return json.data;
}

export const invoiceAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/invoices${qs ? `?${qs}` : ''}`);
  },
  create: (payload) =>
    request('/invoices', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) =>
    request(`/invoices/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (id) =>
    request(`/invoices/${id}`, { method: 'DELETE' }),
};