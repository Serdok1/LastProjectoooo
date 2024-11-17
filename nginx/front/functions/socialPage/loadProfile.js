import { alertSystem } from "../../utils/alertSystem.js";

export async function loadProfile(getUser) {
  const token = localStorage.getItem("access_token");
  const baseUrl = "http://127.0.0.1:8000/user-manage/";

  // Başlangıçta profili yükle
  await loadUserProfile(getUser);

  // Arkadaş ekleme butonu için event listener
  document
    .getElementById("add-friend-btn")
    .addEventListener("click", async () => {
      const url = `${baseUrl}send_friend_request/`;
      const friend_username = document.getElementById("username").textContent;

      try {
        const response = await fetch(url, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ friend_username }),
        });

        if (!response.ok) throw new Error("Arkadaş isteği gönderilemedi");

        const data = await response.json();
        alertSystem.showAlert("Arkadaş isteği gönderildi!");
      } catch (error) {
        alertSystem.showAlert(
          "Arkadaş isteği gönderilirken bir hata oluştu: " + error.message
        );
      }
    });

  // Arkadaş silme butonu için event listener
  document
    .getElementById("remove-friend-btn")
    .addEventListener("click", async () => {
      const url = `${baseUrl}remove_friend/`;
      const friend_username = document.getElementById("username").textContent;

      try {
        const response = await fetch(url, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ friend_username }),
        });

        if (!response.ok) throw new Error("Arkadaş silinemedi");

        const data = await response.json();
        alertSystem.showAlert("Arkadaş silindi!");
      } catch (error) {
        alertSystem.showAlert(
          "Arkadaş silinirken bir hata oluştu: " + error.message
        );
      }
    });

  // Profil düzenleme butonu için event listener
  document.getElementById("edit-button").addEventListener("click", () => {
    window.location.href = "#profile";
  });

  // Arkadaşı engelleme butonu için event listener
  document.getElementById("block-btn").addEventListener("click", async () => {
    const url = `${baseUrl}block_user/`;
    const friend_username = document.getElementById("username").textContent;

    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ friend_username }),
      });

      if (!response.ok) throw new Error("Kullanıcı engellenemedi");

      const data = await response.json();
      alertSystem.showAlert("Kullanıcı engellendi!");
      location.reload();
    } catch (error) {
      alertSystem.showAlert(
        "Kullanıcı engellenirken bir hata oluştu: " + error.message
      );
    }
  });

  document.getElementById("remove-block").addEventListener("click", async () => {
    const url = `${baseUrl}unblock_user/`;
    const friend_username = document.getElementById("username").textContent;

    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ friend_username }),
      });

      if (!response.ok) throw new Error("Kullanıcı engeli kaldırılamadı");

      const data = await response.json();
      alertSystem.showAlert("Kullanıcı engeli kaldırıldı!");
      location.reload();
    }
    catch (error) {
      alertSystem.showAlert(
        "Kullanıcı engeli kaldırılırken bir hata oluştu: " + error.message
      );
    }

  });
}

// Kullanıcı profili yükleme fonksiyonu
export const loadUserProfile = async (username = "") => {
  const token = localStorage.getItem("access_token");
  const baseUrl = "http://127.0.0.1:8000/user-manage/";
  const url = new URL(`${baseUrl}get_user_profile/`);
  if (username) url.searchParams.append("username", username);

  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Profil yüklenemedi");

    const data = await response.json();

    // Profil alanlarını güncelleme
    document.getElementById(
      "name-surname"
    ).textContent = `${data.user.first_name} ${data.user.last_name}`;
    document.getElementById("username").textContent = data.user.username;
    document.getElementById("email").textContent = `${data.user.email}`;
    if (data.profile.bio)
      document.getElementById("bio").textContent = `${data.profile.bio}`;
    document.getElementById("profile-picture").src =
      data.profile.profile_picture;

    if (data.user.username === localStorage.getItem("username")) {
      document.getElementById("add-friend-btn").style.display = "none";
      document.getElementById("edit-button").style.display = "block";
      document.getElementById("block-btn").style.display = "none";
      document.getElementById("remove-friend-btn").style.display = "none";
      document.getElementById("remove-block").style.display = "none";
    } else if (data.is_friend) {
      document.getElementById("add-friend-btn").style.display = "none";
      document.getElementById("edit-button").style.display = "none";
      document.getElementById("block-btn").style.display = "block";
      document.getElementById("remove-friend-btn").style.display = "block";
      document.getElementById("remove-block").style.display = "none";
    } else {
      document.getElementById("add-friend-btn").style.display = "block";
      document.getElementById("edit-button").style.display = "none";
      document.getElementById("block-btn").style.display = "none";
      document.getElementById("remove-friend-btn").style.display = "none";
      document.getElementById("remove-block").style.display = "none";
    }

    if(data.is_blocked) {
      document.getElementById("block-btn").style.display = "none";
      document.getElementById("remove-friend-btn").style.display = "none";
      document.getElementById("remove-block").style.display = "block";
    }

    // Çevrimiçi durumu güncelleme
    const statusIndicator = document.getElementById("status-indicator");
    statusIndicator.classList.toggle("online", data.profile.online_status);
    statusIndicator.classList.toggle("offline", !data.profile.online_status);
    await fetchMatchStats(username);
    await fetchMatchHistory(username);
  } catch (error) {
    alertSystem.showAlert(
      "Profil yüklenirken bir hata oluştu: " + error.message
    );
  }
};

async function fetchMatchHistory(username) {
  if (!username) {
    username = localStorage.getItem("username");
  }
  const token = localStorage.getItem("access_token");
  const baseUrl = "http://127.0.0.1:8000/";
  const url = `${baseUrl}pong-game/get_game_history/`;

  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({username: username}),
    });

    if (!response.ok) throw new Error("Maç geçmişi alınamadı");

    const data = await response.json();
    const matchHistory = document.getElementById("match-history");
    matchHistory.innerHTML = "";
    data.forEach((match, index) => {
      const date = new Date(match.date);
      const li = document.createElement("li");
      li.id = 'match-list-item';
      if(match.is_winner) {
        li.style.backgroundColor = "#8D5DFE";
      }
      else {
        li.style.backgroundColor = "#D1BFFA";
      }
      li.textContent = `Opponent: ${match.opponent} | Score: ${match.user_score} - ${match.opponent_score} | Date: ${date.toDateString()}`;
      matchHistory.appendChild(li);
    });
  }
  catch (error) {
    alertSystem.showAlert(
      "Maç geçmişi alınırken bir hata oluştu: " + error.message
    );
  }
}

async function fetchMatchStats(username){
  if (!username) {
    username = localStorage.getItem("username");
  }
  const token = localStorage.getItem("access_token");
  const baseUrl = "http://127.0.0.1:8000/";
  const url = `${baseUrl}pong-game/get_game_stats/`;

  await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({username: username}),
  })
  .then(response => {
    if (!response.ok) throw new Error("Maç istatistikleri alınamadı");
    return response.json();
  })
  .then(data => {
    console.log(data);
    document.getElementById("win-loss-ratio").textContent = `Win/Loss Ratio: ${data[0].win_rate * 100}%`;
    document.getElementById("matches-won").textContent = `Matches Won: ${data[0].games_won}`;
    document.getElementById("matches-lost").textContent = `Matches Lost: ${data[0].games_lost}`;
  })
  .catch(error => {
    alertSystem.showAlert(
      "Maç istatistikleri alınırken bir hata oluştu: " + error.message
    );
  });
}