export async function loadProfile(getUser) {
    const token = localStorage.getItem("access_token");
    const baseUrl = "http://127.0.0.1:8000/user-manage/";
  
    // Kullanıcı profili yükleme fonksiyonu
    const loadUserProfile = async (username = "") => {
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
        document.getElementById("username").textContent = data.user.username;
        document.getElementById("email").textContent = `Email: ${data.user.email}`;
        document.getElementById("bio").textContent = `Bio: ${data.profile.bio}`;
        document.getElementById("profile-picture").src = data.profile.profile_picture;
  
        // Çevrimiçi durumu güncelleme
        const statusIndicator = document.getElementById("status-indicator");
        statusIndicator.classList.toggle("online", data.profile.online_status);
        statusIndicator.classList.toggle("offline", !data.profile.online_status);
      } catch (error) {
        alert("Profil yüklenirken bir hata oluştu: " + error.message);
      }
    };
  
    // Başlangıçta profili yükle
    await loadUserProfile(getUser);
  
    // Arama butonu için event listener
    document.getElementById("search-btn").addEventListener("click", async () => {
      const searchQuery = document.getElementById("search-input").value;
      await loadUserProfile(searchQuery);
    });
  
    // Arkadaş ekleme butonu için event listener
    document.getElementById("add-friend-btn").addEventListener("click", async () => {
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
        alert("Arkadaş isteği gönderildi!");
      } catch (error) {
        alert("Arkadaş isteği gönderilirken bir hata oluştu: " + error.message);
      }
    });
  }
  