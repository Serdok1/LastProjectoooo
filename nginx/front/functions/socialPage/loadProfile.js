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
    } catch (error) {
      alertSystem.showAlert(
        "Kullanıcı engellenirken bir hata oluştu: " + error.message
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
    } else if (data.is_friend) {
      document.getElementById("add-friend-btn").style.display = "none";
      document.getElementById("edit-button").style.display = "none";
      document.getElementById("block-btn").style.display = "block";
      document.getElementById("remove-friend-btn").style.display = "block";
    } else {
      document.getElementById("add-friend-btn").style.display = "block";
      document.getElementById("edit-button").style.display = "none";
      document.getElementById("block-btn").style.display = "none";
      document.getElementById("remove-friend-btn").style.display = "none";
    }

    // Çevrimiçi durumu güncelleme
    const statusIndicator = document.getElementById("status-indicator");
    statusIndicator.classList.toggle("online", data.profile.online_status);
    statusIndicator.classList.toggle("offline", !data.profile.online_status);
  } catch (error) {
    alertSystem.showAlert(
      "Profil yüklenirken bir hata oluştu: " + error.message
    );
  }
};
