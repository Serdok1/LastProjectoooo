export function loadChatRoom(appElement) {
  appElement.innerHTML = `
           <h1>Chat Room</h1>
           <input id="messageInput" type="text" placeholder="Type your message here..." />
           <button id="sendMessageButton">Send</button>
           <div id="chatMessages"></div>
        `;
}
