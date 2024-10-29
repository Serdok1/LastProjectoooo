import { createTwoFAModal } from "../../utils/twoFAModule.js";

export async function handleLogin(event) {
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
        createTwoFAModal(1); // Create 2FA modal if 2FA is enabled
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
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_secret", data.secret_key);
        localStorage.s;
        window.location.hash = "home"; // Redirect on successful login
      }
    })
    .catch((error) => {
      console.error("Error during login:", error);
      document.getElementById("loginError").textContent =
        "Invalid credentials, please try again.";
    });
}
