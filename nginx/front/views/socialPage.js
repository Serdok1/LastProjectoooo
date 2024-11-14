import { fetchFriendList } from "../functions/socialPage/fetchFriendList.js";
import { fetchFriendRequests } from "../functions/socialPage/fetchFriendRequests.js";
import { loadProfile } from "../functions/socialPage/loadProfile.js";

export function loadSocialPage(appElement) {
  appElement.innerHTML = `
          <div id="every">
            <div id="profile-card">
              <div id="status-card">
                <img id="profile-picture" src="" alt="Profile Picture" class="profile-picture">
                <div id="bottom-card">
                  <div id="btns">
                    <button id="edit-button">Edit profile</button>
                    <button id="add-friend-btn">Add Friend</button>
                    <button id="block-btn">Block</button>
                    <button id="remove-friend-btn">Remove friend</button>
                  </div>
                  <div id="status-indicator" class="status-indicator online"></div>
                  <h2 id="username">Username</h2>
                  <div id="name-stuff">
                    <p id="name-surname">Name Surname</p>
                    <p id="email">Email: user@example.com</p>
                    <p id="bio" class="text-muted"></p>
                  </div>
                  <div id="stats">
                    <p id="win-loss-ratio">Win/Loss Ratio: 70%</p>
                    <p id="matches-won">Matches Won: 30</p>
                    <p id="matches-lost">Matches Lost: 10</p>
                  </div>
                </div>
              </div>
              <div id="match-history">
                <h5>Match History</h5>
                <ul class="list-group" id="match-history-list">
                  <!-- Match history will be loaded here -->
                </ul>
              </div>
            </div>
            <div class="card text-center">
              <div>
                <button id="friend-list-btn" class="btn btn-primary">Friend List</button>
                <button id="friend-requests-btn" class="btn btn-secondary">Friend Requests</button>
              </div>
              <div id="friend-content">
                <ul id="friend-list" class="list-group list-group-flush">
                  <!-- Friend list will be loaded here -->
                </ul>
                <ul id="friend-requests-list" class="list-group list-group-flush" style="display: none;">
                  <!-- Friend requests will be loaded here -->
                </ul>
              </div>
              <div class="card-footer text-muted">© 42</div>
              </div>
          </div>
          <link rel="stylesheet" href="styles/socialPage.css"
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
      `;

  // Load profile on initial page load
  loadProfile();
  // Sayfa yüklendiğinde friend request'leri al
  fetchFriendRequests();
  // Sayfa yüklendiğinde friend list'leri al
  fetchFriendList();

  const friendListBtn = document.getElementById("friend-list-btn");
  const friendRequestsBtn = document.getElementById("friend-requests-btn");
  const friendList = document.getElementById("friend-list");
  const friendRequestsList = document.getElementById("friend-requests-list");

  // Event listeners to toggle between friend list and friend requests
  friendListBtn.addEventListener("click", () => {
    friendList.style.display = "block";
    friendRequestsList.style.display = "none";
    friendRequestsBtn.classList.remove("btn-primary");
    friendRequestsBtn.classList.add("btn-secondary");
    friendListBtn.classList.remove("btn-secondary");
    friendListBtn.classList.add("btn-primary");
  });

  friendRequestsBtn.addEventListener("click", () => {
    friendRequestsList.style.display = "block";
    friendList.style.display = "none";
    friendListBtn.classList.remove("btn-primary");
    friendListBtn.classList.add("btn-secondary");
    friendRequestsBtn.classList.remove("btn-secondary");
    friendRequestsBtn.classList.add("btn-primary");
  });
}


{/* <div class="container mt-5">
<div class="row justify-content-center">
  <div class="col-lg-8">
    <div id="profile-card">
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
</div> */}