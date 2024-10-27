import { loadDefaultProfilePicture, previewProfilePicture } from "../functions/signupPage/profilePictureFuncs.js";
import { handleFormSubmit } from "../functions/signupPage/handleFormSubmit.js";

export function loadSignupPage(appElement) {
  // Signup page HTML içeriği
  const signupPageHtml = `
      <style>
        .profile_picture {
          width: 150px;
          height: 150px;
          object-fit: cover;
          border-radius: 50%;
        }
        .profile_picture-container {
          text-align: center;
          margin-bottom: 20px;
        }
      </style>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-6 col-md-8 col-sm-10">
            <div class="card mt-5 p-4 shadow">
              <h3 class="text-center mb-4">Create Your Account</h3>
              <form id="signupForm" enctype="multipart/form-data">
                <div class="profile_picture-container">
                  <img id="profile_picture" src="public/default.png" alt="Profile Picture" class="profile_picture">
                </div>
                <div class="mb-3 text-center">
                  <button type="button" class="btn btn-secondary" id="changePictureBtn">Change Profile Picture</button>
                  <input class="form-control" type="file" id="profilePictureInput" accept="image/*" style="display: none;">
                </div>
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input type="text" class="form-control" id="username" required>
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email address</label>
                  <input type="email" class="form-control" id="email" required>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="password" required>
                </div>
                <div class="d-grid">
                  <button type="submit" class="btn btn-primary">Sign Up</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

  appElement.innerHTML = signupPageHtml;
  
  const profilePictureInput = document.getElementById("profilePictureInput");
  const profilePictureElement = document.getElementById("profile_picture");
  const changePictureBtn = document.getElementById("changePictureBtn");

  // Varsayılan profil resmini yükle
  loadDefaultProfilePicture(profilePictureElement);

  // Profil resmi değiştirme butonuna tıklayınca dosya seçiciyi aç
  changePictureBtn.addEventListener("click", () => profilePictureInput.click());

  // Seçilen profil resmini önizle
  profilePictureInput.addEventListener("change", () => previewProfilePicture(profilePictureInput, profilePictureElement));

  // Form gönderme işlemini yönet
  document.getElementById("signupForm").addEventListener("submit", (e) => handleFormSubmit(e, profilePictureInput));
}