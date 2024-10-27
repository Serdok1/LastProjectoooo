export async function fetchFriendRequests() {
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