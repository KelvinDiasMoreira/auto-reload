const ws = new WebSocket("ws://127.0.0.1:3000");

ws.onopen = function () {
  console.log("connected with websocket");
};

ws.onclose = function () {
  console.log("WebSocket connection closed.");
  window.location.reload();
};
