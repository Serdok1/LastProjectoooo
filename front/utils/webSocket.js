export async function webSocket() {
    const roomName = "example_room";
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
          user: localStorage.getItem("username"),
        })
      );
  
      /* Uncomment and use these event handlers as needed
      chatSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        const message = data.message;
  
        const chatMessages = document.getElementById("chatMessages");
        chatMessages.innerHTML += `<p>${message}</p>`;
      };
  
      document.getElementById("sendMessageButton").onclick = function (e) {
        const messageInputDom = document.getElementById("messageInput");
        const message = messageInputDom.value;
  
        chatSocket.send(
          JSON.stringify({
            message: message,
          })
        );
  
        messageInputDom.value = "";
      };
      */
    } catch (error) {
      console.error("Failed to establish WebSocket connection", error);
    }
  }