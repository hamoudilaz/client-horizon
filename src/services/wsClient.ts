let ws: WebSocket | null = null;

export const getWebSocket = (): WebSocket | null => {
  if (!ws && import.meta.env.VITE_WS_URL) {
    try {
      ws = new WebSocket(import.meta.env.VITE_WS_URL);
      ws.onopen = () => console.log('Connected to backend WebSocket');
      ws.onclose = () => {
        console.log('WebSocket closed');
        ws = null;
      };
      ws.onerror = (error) => console.error('WebSocket Error:', error);
    } catch (err) {
      console.error('Failed to create WebSocket:', err);
      return null;
    }
  }
  return ws;
};

export default { getWebSocket };
