const BASE = import.meta.env.VITE_API_BASE;

export async function getPortfolioById(id) {
  const res = await fetch(`${BASE}/api/portfolio/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch portfolio");
  return data;
}

export async function reviewPortfolio(id, body) {
  const res = await fetch(`${BASE}/api/portfolio/${id}/review`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Review failed");
  return data;
}

