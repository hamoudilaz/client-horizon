const API_BASE = import.meta.env.VITE_API_URL || '';

export async function startDemoSession(amount: number) {
  const request = await fetch(`${API_BASE}/api/demo/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ amount }),
  });

  const value = await request.json();
  if (value.error) {
    return { error: value.error };
  }

  return value;
}
