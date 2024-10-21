export function loadChatRoom(appElement) {
  appElement.innerHTML = `
    <h1>Chat Room</h1>
    <input id="messageInput" type="text" placeholder="Type your message here..." />
    <button id="sendMessageButton">Send</button>
    <div id="chatMessages"></div>
  `;
  webSocket();
}

export async function webSocket() {
  const roomName = "56_55";
  const secretKey = "cc19e6cc697a07ea45077d6b7ac776a0";
  const chatSocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomName}/${secretKey}/`);

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

    // WebSocket bağlantısı kurulduğunda
    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      
      const chatMessages = document.getElementById("chatMessages");

      // Eski mesajlar varsa onları göster
      if (data.old_messages) {
        data.old_messages.forEach(msg => {
          chatMessages.innerHTML += `<p><strong>${msg.user}:</strong> ${msg.content}</p>`;
        });
      }

      // Yeni mesaj varsa onu göster
      if (data.message) {
        const message = data.message;
        const user = data.user;

        chatMessages.innerHTML += `<p><strong>${user}:</strong> ${message}</p>`;
      }
    };

    // Mesaj gönderme butonuna tıklama olayı
    document.getElementById("sendMessageButton").onclick = function (e) {
      const messageInputDom = document.getElementById("messageInput");
      const message = messageInputDom.value;

      // WebSocket ile mesaj gönder
      chatSocket.send(
        JSON.stringify({
          message: message,
          user: localStorage.getItem("username"),
        })
      );

      // Mesaj kutusunu temizle
      messageInputDom.value = "";
    };
    
  } catch (error) {
    console.error("Failed to establish WebSocket connection", error);
  }

  // WebSocket bağlantısını kapatmadan önce, kullanıcı durumu gibi bilgiler gönderebilirsiniz
  /* window.onbeforeunload = function () {
    chatSocket.send(
      JSON.stringify({
        status: "offline",
        user: localStorage.getItem("username"),
      })
    );
    chatSocket.close();
  } */
}