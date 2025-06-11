export async function startDemoSession(amount: number) {
  const request = await fetch(`${import.meta.env.VITE_API_URL}/api/start/demo`, {
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
