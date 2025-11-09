const API_BASE = import.meta.env.VITE_API_URL || '';

export async function getAmount() {
  try {
    const data = await fetch(`${API_BASE}/api/amount`, {
      method: 'GET',
      credentials: 'include',
    });
    return await data.json();
  } catch (err) {
    console.error('Error fetching amount:', err);
    return err;
  }
}
