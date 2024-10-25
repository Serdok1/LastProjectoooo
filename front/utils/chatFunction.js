export async function startChatSocket(friend_id, user_id) {
    // Create a chat box if it doesn't already exist
    let chatBox = document.getElementById("chatBox");
    if (!chatBox) {
        chatBox = document.createElement("div");
        chatBox.id = "chatBox";
        chatBox.style.position = "fixed";
        chatBox.style.bottom = "0";
        chatBox.style.right = "20px";
        chatBox.style.width = "300px";
        chatBox.style.maxHeight = "400px";
        chatBox.style.border = "1px solid #ccc";
        chatBox.style.borderRadius = "5px";
        chatBox.style.backgroundColor = "white";
        chatBox.style.overflow = "hidden";
        chatBox.innerHTML = `
            <div style="padding: 10px; background-color: #007bff; color: white;">
                <strong>Chat</strong>
            </div>
            <div id="chatMessages" style="padding: 10px; overflow-y: auto; height: 250px;"></div>
            <div style="padding: 10px;">
                <input type="text" id="messageInput" class="form-control" placeholder="Type a message..." />
                <button id="sendMessageButton" class="btn btn-primary btn-sm mt-2" style="width: 100%;">Send</button>
            </div>
        `;
        document.body.appendChild(chatBox);
    }

    if (friend_id < user_id) {
        [friend_id, user_id] = [user_id, friend_id];
    }
    const roomName = `${friend_id}_${user_id}`;
    const secretKey = localStorage.getItem("user_secret");
    const chatSocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomName}/${secretKey}/`);
    
    const waitForConnection = new Promise((resolve, reject) => {
        chatSocket.onopen = function () {
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

        chatSocket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            const chatMessages = document.getElementById("chatMessages");

            if (data.old_messages) {
                data.old_messages.forEach(msg => {
                    chatMessages.innerHTML += `<p><strong>${msg.user}:</strong> ${msg.content}</p>`;
                });
            }

            if (data.message) {
                chatMessages.innerHTML += `<p><strong>${data.user}:</strong> ${data.message}</p>`;
            }
            chatMessages.scrollTop = chatMessages.scrollHeight;  // Auto-scroll to the latest message
        };

        document.getElementById("sendMessageButton").onclick = function () {
            const messageInputDom = document.getElementById("messageInput");
            const message = messageInputDom.value;

            chatSocket.send(JSON.stringify({
                message,
                user: localStorage.getItem("username"),
            }));
            messageInputDom.value = "";  // Clear input field
        };
    } catch (error) {
        console.error("Failed to establish WebSocket connection", error);
    }
}
