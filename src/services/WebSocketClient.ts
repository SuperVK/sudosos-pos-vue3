import { useWebSocketStore } from "@/stores/websocket.store";

const setupWebSocketClient = () => {
  const webSocketStore = useWebSocketStore();
  webSocketStore.setConnecting(true);
  const ws = new WebSocket(`${import.meta.env.VITE_APP_WS}`);

  ws.onopen = () => {
    webSocketStore.setConnecting(false);
    webSocketStore.setConnected(true);
    console.log('WebSocket connection opened');
  };

  ws.onmessage = (event) => {
    const newTransaction = JSON.parse(event.data);
    console.log('Received new transaction:', newTransaction);
    // Handle the new transaction data on the client-side as needed
  };

  ws.onclose = () => {
    webSocketStore.setConnected(false);
    console.log('Socket is closed. Reconnect will be attempted in 1 second.');
    setTimeout(function() {
      setupWebSocketClient();
    }, 1000);
    console.log('WebSocket connection closed');
  };

  ws.onerror = () => {
    webSocketStore.setConnected(false);
    webSocketStore.setConnecting(false);
    console.log('WebSocket connection errored');
  };
};

export const setupAuthenticatedWebSocket = (token: string) => {
  const ws = new WebSocket(`${import.meta.env.VITE_APP_WS}`);

  ws.onopen = () => {
    console.error(token);
    ws.send(JSON.stringify({ type: 'authentication', token }));
    console.log('WebSocket connection opened');
  };

  ws.onmessage = (event) => {
    const newTransaction = JSON.parse(event.data);
    console.log('Received new transaction:', newTransaction);
    // Handle the new transaction data on the client-side as needed
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };

  ws.onerror = () => {
    console.log('WebSocket connection errored');
  };

};
export default setupWebSocketClient;
