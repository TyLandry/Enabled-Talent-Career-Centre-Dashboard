const API_URL = "http://localhost:5050";

export async function fetchDashboardMetrics() {
  const res = await fetch(`${API_URL}/api/dashboard`);
  if (!res.ok) {
    throw new Error("Failed to fetch dashboard metrics");
  }
  return res.json();
}