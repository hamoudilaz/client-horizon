export async function getAmount() {
  try {
    const data = await fetch(`${import.meta.env.VITE_API_URL}/api/amount`, {
      method: 'GET',
      credentials: 'include',
    });
    return await data.json();
  } catch (err) {
    console.error('Error fetching amount:', err);
    return err;
  }
}
