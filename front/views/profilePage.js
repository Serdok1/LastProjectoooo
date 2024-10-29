import { setupProfilePage } from '../functions/profilePage/setupProfilePage.js';

export function loadProfilePage(appElement) {
  appElement.innerHTML = `
    <div class="container mt-5">
      <h1 class="text-center mb-4">Profil Sayfası</h1>
      <div class="card p-4">
        <div class="text-center mb-3 position-relative">
          <img id="profile-picture" src="" class="rounded-circle" alt="Profil Resmi" style="width: 150px; height: 150px; object-fit: cover;">
          <span id="status-indicator" class="position-absolute bottom-0 end-0 translate-middle p-2 border border-light rounded-circle" style="background-color: grey; width: 15px; height: 15px;"></span>
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
    <div class="modal" id="qrcodeModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">2FA Etkinleştirme</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            <div id="qr-step">
              <img id="qrcode-image" alt="QR Kod" class="img-fluid mb-3">
              <p>QR kodu tarayın ve ardından ilerleyin.</p>
            </div>
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

  setupProfilePage();
}
