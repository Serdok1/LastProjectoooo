import { startChatSocket } from "../../utils/chatFunction.js";

export async function fetchFriendList() {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/user-manage/get_friends/",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const friends = await response.json();
    const friendsList = document.getElementById("friends-list");
    friendsList.innerHTML = ""; // Clear existing list items before appending

    friends.forEach((friend) => {
      const listItem = document.createElement("li");
      listItem.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );

      const uniqueId = friend.id; // Unique ID for each friend

      listItem.innerHTML = `
        <div class="d-flex align-items-center">
          <img src="${friend.profile_picture}" alt="profile" class="rounded-circle" width="50" height="50">
          <div class="ml-3">
            <h6 class="mb-0">${friend.first_name} ${friend.last_name}</h6>
            <small>@${friend.username}</small>
          </div>
          <span class="p-1"/>
          <div id="status-friend-${uniqueId}" class="status-friend ${friend.online_status ? 'online' : 'offline'}"></div>
        </div>
        <div>
          <button id="remove-btn-${uniqueId}" class="btn btn-danger btn-sm">Remove</button>
          <button id="message-btn-${uniqueId}" class="btn btn-primary btn-sm">Message</button>
        </div>
      `;

      friendsList.appendChild(listItem);

      // Add event listener for the Remove button
      listItem.querySelector(`#remove-btn-${uniqueId}`).addEventListener("click", () => {
        removeFriend(friend.username);
      });

      // Add event listener for the Message button
      listItem.querySelector(`#message-btn-${uniqueId}`).addEventListener("click", () => {
        startChatSocket(friend.id, localStorage.getItem("user_id"));
        console.log("Chat started!", friend.id, localStorage.getItem("user_id"));
      });

      // Set the online status
      const statusIndicator = listItem.querySelector(`#status-friend-${uniqueId}`);
      statusIndicator.classList.toggle("online", friend.online_status);
      statusIndicator.classList.toggle("offline", !friend.online_status);
    });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
  }

  // Function to remove a friend
  async function removeFriend(username) {
    try {
      await fetch("http://127.0.0.1:8000/user-manage/remove_friend/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friend_username: username }),
      });
      console.log("Friend removed!");
      location.reload();
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  }
}
