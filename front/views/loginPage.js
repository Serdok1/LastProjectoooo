import { getCSRFToken } from "../utils/getCsrfToken.js";
export function loadLoginPage(appElement) {
  appElement.innerHTML = `
          <h1>Login</h1>
          <form id="loginForm">
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input type="text" class="form-control" id="username" required>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control" id="password" required>
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
          </form>
           <button id="loginWith42" class="btn btn-danger mt-3">Login with 42</button>
          <p id="loginError" class="text-danger"></p>
          <button id="signupButton" class="btn btn-link">Don't have an account? Sign up!</button>

          <div class="modal fade" id="2faModal" tabindex="-1" aria-labelledby="2faModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="2faModalLabel">2FA Code</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <input type="text" class="form-control" id="2faCode" placeholder="Enter your 2FA code" required>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-primary" id="2faSubmit">Submit</button>
                </div>
              </div>
            </div>
          </div>
        `;

  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  document.getElementById("loginWith42").addEventListener("click", handleLoginWith42);
  document.getElementById("2faSubmit").addEventListener("click", handle2faSubmit);
  document.getElementById("signupButton").addEventListener("click", () => {
    window.location.hash = "signup";
  });
}

async function handleLogin(event) {
  event.preventDefault(); // Prevent default form submission
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  localStorage.clear();
  localStorage.setItem("username", username);

  await fetch("http://127.0.0.1:8000/auth-work/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      if (response.status === 401) {
        const twoFaModal = new bootstrap.Modal(document.getElementById("2faModal"));
        twoFaModal.show();
        return;
      } else if (!response.ok) {
        throw new Error("Login failed");
      }
      return response.json();
    })
    .then((data) => {
      if (data) {
        // Store tokens
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        window.location.hash = "home"; // Redirect on successful login
      }
    })
    .catch((error) => {
      console.error("Error during login:", error);
      document.getElementById("loginError").textContent = "Invalid credentials, please try again.";
    });
}

function handleLoginWith42() {
  const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-d6c2cb57496404dab82b9aec96d96cbb6793bb5005632c3cf384a17bf7b8e98f&redirect_uri=http%3A%2F%2F127.0.0.1%3A5500%2Ffront%2F&response_type=code`;

  window.location.href = authUrl; // Redirect to 42's OAuth page
}

async function handle2faSubmit() {
  const code = document.getElementById("2faCode").value;
  const csrfToken = getCSRFToken();

  await fetch("http://127.0.0.1:8000/two-factor/token-after-2fa/", {
    method: "POST",
    headers: {
      "X-CSRFToken": csrfToken,
      "Content-Type": "application/json",
    },
    credentials: "include",  // If you're using session-based authentication
    body: JSON.stringify({ otp_token: code, user: localStorage.getItem("username") }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("2FA verification failed");
      }
      return response.json();
    })
    .then((data) => {
      // Store tokens after successful 2FA verification
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      window.location.hash = "home"; // Redirect to the homepage
    })
    .catch((error) => {
      console.error("Error during 2FA verification:", error);
      alert("Invalid 2FA code, please try again.");
    })
    .finally(() => {
      window.location.reload();
    });
}

