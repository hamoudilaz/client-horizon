export async function LoadKey(key: string) {
  const request = await fetch(`${import.meta.env.VITE_API_URL}/api/loadKey`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ key }),
  });

  const pubKey = await request.json();
  console.log(pubKey);
  if (pubKey.error) {
    return { error: pubKey.error };
  }

  return pubKey;
}

export function validateKey(key: string) {
  return key.length >= 86 && key.length <= 89 && /^[A-Za-z0-9]+$/.test(key);
}

export async function logout() {
  await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}
