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

export const customerAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/customers${qs ? `?${qs}` : ''}`);
  },
  create: (payload) =>
    request('/customers', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) =>
    request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (id) =>
    request(`/customers/${id}`, { method: 'DELETE' }),
};