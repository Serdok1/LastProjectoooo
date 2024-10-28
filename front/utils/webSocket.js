export async function webSocket() {
  const chatSocket = new WebSocket(`ws://127.0.0.1:8000/ws/status/`);

  const waitForConnection = new Promise((resolve, reject) => {
    chatSocket.onopen = function (e) {
      console.log("WebSocket connection established");
      resolve();
    };

    chatSocket.onerror = function (e) {
      console.error("WebSocket connection error");
      reject(e);
    };
  });

  try {
    await waitForConnection;

    chatSocket.onclose = function (e) {
      console.error("Chat socket closed unexpectedly");
    };

    chatSocket.send(
      JSON.stringify({
        status: "online",
        user: localStorage.getItem("username"),
      })
    );

  } catch (error) {
    console.error("Failed to establish WebSocket connection", error);
  }

  window.onbeforeunload = function () {
    chatSocket.send(
      JSON.stringify({
        status: "offline",
        user: localStorage.getItem("username"),
      })
    );
    chatSocket.close();
  };
}
