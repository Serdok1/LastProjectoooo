import { startChatSocket } from "../utils/chatFunction.js";

export function loadSocialPage(appElement) {
  appElement.innerHTML = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Profile Page</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
              .profile-picture {
                width: 150px;
                height: 150px;
                object-fit: cover;
                border-radius: 50%;
              }
              .status-indicator {
                width: 15px;
                height: 15px;
                border-radius: 50%;
                position: absolute;
                bottom: 0;
                right: 0;
                border: 2px solid white;
              }
              .online {
                background-color: #28a745;
              }
              .offline {
                background-color: #dc3545;
              }
              .win-loss-ratio {
                font-size: 1.2rem;
                font-weight: bold;
              }
              .match-history {
                max-height: 200px;
                overflow-y: auto;
              }
            </style>
          </head>
          <body>
            <div class="container mt-5">
              <div class="row justify-content-center">
                <div class="col-lg-8">
                  <div class="card p-4">
                    <!-- Search box -->
                    <div class="mb-4">
                      <input type="text" id="search-input" class="form-control" placeholder="Search by username">
                      <button id="search-btn" class="btn btn-primary mt-2">Search</button>
                    </div>
    
                    <div class="d-flex align-items-center">
                      <div class="position-relative me-4">
                        <img id="profile-picture" src="" alt="Profile Picture" class="profile-picture">
                        <div id="status-indicator" class="status-indicator online"></div>
                      </div>
                      <div>
                        <h2 id="username" class="mb-0">Username</h2>
                        <p id="bio" class="text-muted">Bio: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        <p id="email">Email: user@example.com</p>
                      </div>
                      <button id="add-friend-btn" class="btn btn-primary ms-auto">Add Friend</button>
                    </div>
                    <div class="row mt-4">
                      <div class="col-md-4 text-center">
                        <div class="win-loss-ratio" id="win-loss-ratio">Win/Loss Ratio: 70%</div>
                      </div>
                      <div class="col-md-4 text-center">
                        <div id="matches-won">Matches Won: 30</div>
                      </div>
                      <div class="col-md-4 text-center">
                        <div id="matches-lost">Matches Lost: 10</div>
                      </div>
                    </div>
                    <div class="mt-4">
                      <h5>Match History</h5>
                      <ul class="list-group match-history" id="match-history">
                        <li class="list-group-item">Match 1: Won</li>
                        <li class="list-group-item">Match 2: Lost</li>
                        <li class="list-group-item">Match 3: Won</li>
                      </ul>
                    </div>
                  </div>
                  <!-- friend "request list -->
                <div class="card" style="max-height: 400px; overflow-auto;">
                    <div class="card-header">
                        Friend Requests
                    </div>
                    <ul id="friend-requests-list" class="list-group list-group-flush">
                        <!-- Friend request'ler buraya dinamik olarak eklenecek -->
                    </ul>
                </div>
                <!-- friend list -->
                <div class="card" style="max-height: 400px; overflow-auto;">
                    <div class="card-header">
                        Friend List
                    </div>
                    <ul id="friends-list" class="list-group list-group-flush">
                        <!-- Friend buraya dinamik olarak eklenecek -->
                    </ul>
                </div>
                </div>
              </div>
            </div>
    
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
          </body>
          </html>
      `;
  // Load profile on initial page load
  loadProfile();
  // Sayfa yüklendiğinde friend request'leri al
  fetchFriendRequests();
  // Sayfa yüklendiğinde friend list'leri al
  fetchFriendList();
}

async function fetchFriendList() {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/user-manage/get_friends/",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // JWT token'ı localStorage'dan al
          "Content-Type": "application/json",
        },
      }
    );

    // Cevabı JSON olarak çöz
    const friends = await response.json();

    // Listeyi gösteren DOM elementini alalım
    const friendsList = document.getElementById("friends-list");

    // Eğer istek başarılıysa friend request'leri gösterelim
    friends.forEach((friend) => {
      // Her bir arkadaş için liste öğesi oluştur
      const listItem = document.createElement("li");
      listItem.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );
      
      // İçeriği oluştur
      listItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${friend.profile_picture}" alt="profile" class="rounded-circle" width="50" height="50">
                    <div class="ml-3">
                        <h6 class="mb-0">${friend.first_name} ${friend.last_name}</h6>
                        <small>@${friend.username}</small>
                    </div>
                </div>
                <div>
                    <button id="remove-btn" class="btn btn-danger btn-sm" onclick="removeFriend('${friend.username}')">Remove</button>
                    <button id="message-btn" class="btn btn-primary btn-sm">Message</button>
                </div>
            `;
      // Liste öğesini ul'ye ekleyelim
      friendsList.appendChild(listItem);
      document.getElementById("remove-btn").addEventListener("click", () => {
        removeFriend(friend.username);
      })
      document.getElementById("message-btn").addEventListener("click", () => {
        startChatSocket(friend.id, localStorage.getItem("user_id"));
      });
    });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
  }

  // Remove friend butonu için fonksiyon
  async function removeFriend(username) {
    try {
      await fetch("http://127.0.0.1:8000/user-manage/remove_friend/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // JWT token'ı
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friend_username: username }),
      });
      console.log("Friend removed!");
      // Tekrar listeyi yükleyelim
      location.reload();
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  }
}

// Load friend requests
async function fetchFriendRequests() {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/user-manage/get_friend_requests/",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // JWT token'ı localStorage'dan al
          "Content-Type": "application/json",
        },
      }
    );

    // Cevabı JSON olarak çöz
    const friendRequests = await response.json();

    // Listeyi gösteren DOM elementini alalım
    const friendRequestsList = document.getElementById("friend-requests-list");

    // Eğer istek başarılıysa friend request'leri gösterelim
    friendRequests.forEach((friend) => {
      // Her bir arkadaş için liste öğesi oluştur
      const listItem = document.createElement("li");
      listItem.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );

      // İçeriği oluştur
      listItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${friend.profile_picture}" alt="profile" class="rounded-circle" width="50" height="50">
                    <div class="ml-3">
                        <h6 class="mb-0">${friend.first_name} ${friend.last_name}</h6>
                        <small>@${friend.username}</small>
                    </div>
                </div>
                <div>
                    <button id="accept-btn" class="btn btn-success btn-sm mr-2" onclick="acceptRequest('${friend.username}')">Accept</button>
                    <button id="decline-btn" class="btn btn-danger btn-sm" onclick="declineRequest('${friend.username}')">Decline</button>
                </div>
            `;

      // Liste öğesini ul'ye ekleyelim
      friendRequestsList.appendChild(listItem);
      document.getElementById("accept-btn").addEventListener("click", () => {
        acceptRequest(friend.username);
      });
      document.getElementById("decline-btn").addEventListener("click", () => {
        declineRequest(friend.username);
      });
    });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
  }

  // Kabul etme butonu için fonksiyon
  async function acceptRequest(username) {
    try {
      await fetch("http://127.0.0.1:8000/user-manage/accept_friend_request/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // JWT token'ı
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friend_username: username }),
      });
      console.log("Friend request accepted!");
      // Tekrar listeyi yükleyelim
      location.reload();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  }

  // Reddetme butonu için fonksiyon
  async function declineRequest(username) {
    try {
      await fetch("/api/decline-friend-request/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT token'ı
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friend_username: username }),
      });
      alert("Friend request declined!");
      // Tekrar listeyi yükleyelim
      location.reload();
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  }
}

// Load profile info from the API, with optional search query
function loadProfile(getUser) {
  const token = localStorage.getItem("access_token");
  const url = new URL("http://127.0.0.1:8000/user-manage/get_user_profile/");

  const username = getUser || "";

  if (username) url.searchParams.append("username", username);

  fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Updating the profile fields dynamically
      document.getElementById("username").textContent = data.user.username;
      document.getElementById(
        "email"
      ).textContent = `Email: ${data.user.email}`;
      document.getElementById("bio").textContent = `Bio: ${data.profile.bio}`;
      document.getElementById("profile-picture").src =
        data.profile.profile_picture;

      // Handling online status
      const statusIndicator = document.getElementById("status-indicator");
      if (data.profile.online_status) {
        statusIndicator.classList.add("online");
        statusIndicator.classList.remove("offline");
      } else {
        statusIndicator.classList.add("offline");
        statusIndicator.classList.remove("online");
      }
    })
    .catch((error) => console.error("Error loading profile:", error));

  // Add event listener to search button
  document.getElementById("search-btn").addEventListener("click", () => {
    const searchQuery = document.getElementById("search-input").value;
    loadProfile(searchQuery);
  });

  //add friend
  document.getElementById("add-friend-btn").addEventListener("click", () => {
    const url = "http://127.0.0.1:8000/user-manage/send_friend_request/";
    const token = localStorage.getItem("access_token");
    const friend_username = document.getElementById("username").textContent;
    fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ friend_username }),
    })
      .then((response) => console.log(response.json()))
      .catch((error) => console.error("Error sending friend request:", error));
  });
}
