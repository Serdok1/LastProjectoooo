export function loadSignupPage(appElement) {
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

  // Insert the signup page HTML into the #app element or any container
  appElement.innerHTML = signupPageHtml;

  // Add event listeners after the page content is loaded
  const profilePictureInput = document.getElementById("profilePictureInput");
  const profile_picture = document.getElementById("profile_picture");
  const changePictureBtn = document.getElementById("changePictureBtn");

  //change default profile picture with the one from the server
  fetch("http://127.0.0.1:8000/user-manage/get_default_pp/", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to get default profile picture");
      }
      return response.blob(); // Get the image blob
    })
    .then((blob) => {
      const profilePictureElement = document.getElementById("profile_picture");
      profilePictureElement.src = URL.createObjectURL(blob); // Set the blob as image source
    })
    .catch((error) => {
      console.error("Error getting default profile picture:", error);
    });
  

  // When the "Change Profile Picture" button is clicked, trigger the file input
  changePictureBtn.addEventListener("click", function () {
    profilePictureInput.click();
  });

  // Preview selected image
  profilePictureInput.addEventListener("change", function () {
    const file = profilePictureInput.files[0];
    if (file) {
      profile_picture.src = URL.createObjectURL(file);
    }
  });

  // Form submit handler
  document
    .getElementById("signupForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      // Create a FormData object to send form data including files
      const formData = new FormData();
      formData.append("username", document.getElementById("username").value);
      formData.append("email", document.getElementById("email").value);
      formData.append("password", document.getElementById("password").value);

      // If a profile picture is selected, add it to the formData
      if (profilePictureInput.files[0]) {
        formData.append("profile_picture", profilePictureInput.files[0]);
      }

      // Send the form data to the backend using fetch
      fetch("http://127.0.0.1:8000/auth-work/signup/", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Signup failed");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Signup successful!");
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          window.location.hash = "home";
        })
        .catch((error) => {
          console.error("Error during signup:", error);
        });
    });
}
