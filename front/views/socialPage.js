import { fetchFriendList } from "../functions/socialPage/fetchFriendList.js";
import { fetchFriendRequests } from "../functions/socialPage/fetchFriendRequests.js";
import { loadProfile } from "../functions/socialPage/loadProfile.js";

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
              .status-friend {
                width: 15px;
                height: 15px;
                border-radius: 50%;
                position: relative;
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