import { alertSystem } from "../../utils/alertSystem.js";

export async function fetchFriendRequests() {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/user-manage/get_friend_requests/",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const friendRequests = await response.json();
    const friendRequestsList = document.getElementById("friend-requests-list");

    // Clear the list first
    friendRequestsList.innerHTML = "";

    friendRequests.forEach((friend) => {
      const listItem = document.createElement("li");

      listItem.innerHTML = `
        <div class="friend-requests-list-item">
          <img src="${friend.profile_picture}" alt="profile" class="rounded-circle" width="49" height="49">
          <h6 class="mb-0">${friend.first_name} ${friend.last_name}</h6>
          <button class="accept-btn btn btn-success btn-sm mr-2">Accept</button>
          <button class="decline-btn btn btn-danger btn-sm">Decline</button>
        </div>
      `;

      friendRequestsList.appendChild(listItem);

      // Add event listeners for each button within the list item
      listItem.querySelector(".accept-btn").addEventListener("click", async () => {
        await acceptRequest(friend.username);
      });
      listItem.querySelector(".decline-btn").addEventListener("click", async () => {
        await declineRequest(friend.username);
      });
    });
  } catch (error) {
    alertSystem.showAlert("An error occurred while fetching friend requests: " + error.message);
    console.error("Error fetching friend requests:", error);
  }

  async function acceptRequest(username) {
    try {
      await fetch("http://127.0.0.1:8000/user-manage/accept_friend_request/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friend_username: username }),
      });
      alertSystem.showAlert("Friend request accepted!");
      console.log("Friend request accepted!");
      location.reload();
    } catch (error) {
      alertSystem.showAlert("An error occurred while accepting friend request: " + error.message);
      console.error("Error accepting friend request:", error);
    }
  }

  async function declineRequest(username) {
    try {
      await fetch("http://127.0.0.1:8000/user-manage/decline_friend_request/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friend_username: username }),
      });
      alertSystem.showAlert("Friend request declined!");
      location.reload();
    } catch (error) {
      alertSystem.showAlert("An error occurred while declining friend request: " + error.message);
      console.error("Error declining friend request:", error);
    }
  }
}
