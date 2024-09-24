export function loadProfilePage(appElement) {
  appElement.innerHTML = `
      <div class="container mt-5">
          <h1 class="text-center mb-4">Profil Sayfası</h1>
          <div class="card p-4">
              <div class="text-center mb-3">
                  <img id="profile-picture" src="" class="rounded-circle" alt="Profil Resmi" style="width: 150px; height: 150px; object-fit: cover;">
                  <div class="mt-2">
                      <button id="change-picture" class="btn btn-primary">Profil Resmini Değiştir</button>
                      <input type="file" id="upload-picture" style="display: none;">
                  </div>
              </div>
              <form id="profile-form">
                  <div class="mb-3">
                      <label for="username" class="form-label">Kullanıcı Adı:</label>
                      <input type="text" id="username" class="form-control" name="username">
                  </div>
                  <div class="mb-3">
                      <label for="email" class="form-label">E-posta:</label>
                      <input type="email" id="email" class="form-control" name="email">
                  </div>
                  <div class="mb-3">
                      <label for="bio" class="form-label">Hakkında:</label>
                      <textarea id="bio" class="form-control" name="bio"></textarea>
                  </div>
                  <div class="mb-3">
                      <label for="phone_number" class="form-label">Phone:</label>
                      <textarea id="phone_number" class="form-control" name="phone_number"></textarea>
                  </div>
                  <button type="submit" id="save-button" class="btn btn-success">Kaydet</button>
              </form>
               <button id="enable-2fa-button" class="btn btn-warning mt-3">2FA Etkinleştir</button>
              <button id="sign-out-button" class="btn btn-danger mt-3">Çıkış Yap</button>
          </div>
      </div>

  <!-- Modal -->
      <div class="modal" id="qrcodeModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">2FA Etkinleştirme</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
              <!-- İlk adım: QR kodu gösterme -->
              <div id="qr-step">
                <img id="qrcode-image" alt="QR Kod" class="img-fluid mb-3">
                <p>QR kodu tarayın ve ardından ilerleyin.</p>
              </div>
              <!-- İkinci adım: Kod girme -->
              <div id="code-step" style="display: none;">
                <input type="text" id="2fa-code" class="form-control mb-3" placeholder="Doğrulama kodunu girin">
                <div id="loading-animation" style="display: none;">Yükleniyor...</div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="previous-step" style="display: none;">Geri</button>
              <button type="button" class="btn btn-primary" id="next-step">İleri</button>
            </div>
          </div>
        </div>
      </div>
  `;

  // Profil sayfası yüklendikten sonra gerekli script'leri çalıştır
  setupProfilePage();
}

import { getCSRFToken } from "../utils/getCsrfToken.js";

function setupProfilePage() {
  const profileForm = document.getElementById("profile-form");
  const signOutButton = document.getElementById("sign-out-button");
  const changePictureButton = document.getElementById("change-picture");
  const uploadPictureInput = document.getElementById("upload-picture");
  const enable2FAButton = document.getElementById("enable-2fa-button");

  const token = localStorage.getItem("access_token");
  const csrfToken = getCSRFToken();

  enable2FAButton.addEventListener("click", () => {
    fetch("http://127.0.0.1:8000/two-factor/generate-qr/", {
      method: "POST",
      headers: {
        "X-CSRFToken": `${csrfToken}`,
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then((response) => response.blob()) // QR kodunu blob olarak al
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        document.getElementById("qrcode-image").src = url;
        const qrModal = new bootstrap.Modal(
          document.getElementById("qrcodeModal")
        );
        qrModal.show();
      })
      .catch((error) => console.error("2FA etkinleştirme hatası:", error));
  });

  const nextStepButton = document.getElementById("next-step");
  const previousStepButton = document.getElementById("previous-step");
  const qrStep = document.getElementById("qr-step");
  const codeStep = document.getElementById("code-step");
  const loadingAnimation = document.getElementById("loading-animation");

  // İlk adımda QR kodu gösteriliyor
  nextStepButton.addEventListener("click", () => {
    if (qrStep.style.display !== "none") {
      // QR adımını gizle, kod girme adımını göster
      qrStep.style.display = "none";
      codeStep.style.display = "block";
      previousStepButton.style.display = "inline-block";
      nextStepButton.innerHTML = "Onayla";
    } else {
      // Doğrulama kodunu gönderme adımı
      const code = document.getElementById("2fa-code").value;
      loadingAnimation.style.display = "block";
      nextStepButton.disabled = true;

      fetch("http://127.0.0.1:8000/two-factor/verify-otp/", {
        method: "POST",
        headers: {
          "X-CSRFToken": `${csrfToken}`,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ otp_token: code }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Doğrulama başarısız oldu.");
          }
          loadingAnimation.style.display = "none";
          nextStepButton.disabled = false;
          nextStepButton.innerHTML = "Tamamlandı";
          nextStepButton.disabled = true;
          return response.json();
        })
        .catch((error) => {
          console.error("Doğrulama hatası:", error);
          loadingAnimation.style.display = "none";
          nextStepButton.disabled = false;
        });
    }
  });

  previousStepButton.addEventListener("click", () => {
    // Geri butonuna basıldığında QR adımına geri dön
    qrStep.style.display = "block";
    codeStep.style.display = "none";
    previousStepButton.style.display = "none";
    nextStepButton.innerHTML = "İleri";
  });

  // Profil bilgilerini API'den al
  function loadProfile() {
    fetch("http://127.0.0.1:8000/user-manage/user_info/", {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("username").value = data.user.username;
        document.getElementById("email").value = data.user.email;
        document.getElementById("bio").value = data.profile.bio;
        document.getElementById("phone_number").value =
          data.profile.phone_number;
        document.getElementById("profile-picture").src =
          data.profile.profile_picture;
        if (data.profile.two_factor_auth) {
          enable2FAButton.style.background = "green";
          enable2FAButton.style.color = "white";
          enable2FAButton.style.border = "none";
          enable2FAButton.innerHTML = "2FA Enabled";
          enable2FAButton.disabled = true;
        }
      })
      .catch((error) => console.error("Error loading profile:", error));
  }

  // Profil bilgilerini güncelle
  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(profileForm);
    const token = localStorage.getItem("access_token");
    console.log(formData);

    fetch("http://127.0.0.1:8000/user-manage/update_user_info/", {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Profil güncellendi.");
        } else {
          alert("Profil güncellenirken bir hata oluştu.");
        }
      })
      .catch((error) => console.error("Error updating profile:", error));
  });

  // Çıkış yap butonuna tıklama
  signOutButton.addEventListener("click", () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("oauth_access_token");
    localStorage.removeItem("oauth_token");
    localStorage.removeItem("oauth_refresh_token");
    window.location.reload();
  });

  // Profil resmini değiştirme
  changePictureButton.addEventListener("click", () => {
    uploadPictureInput.click();
  });

  uploadPictureInput.addEventListener("change", () => {
    const file = uploadPictureInput.files[0];
    const formData = new FormData();
    formData.append("profile_picture", file);

    // Fetch the token from local storage
    const token = localStorage.getItem("access_token");

    fetch("http://127.0.0.1:8000/user-manage/update_profile_picture/", {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the profile picture on the front-end
        if (data.profile_picture_url) {
          document.getElementById("profile-picture").src =
            data.profile_picture_url;
        }
      })
      .catch((error) => console.error("Error uploading picture:", error));
  });

  // Sayfa yüklendiğinde profil bilgilerini getir
  loadProfile();
}
