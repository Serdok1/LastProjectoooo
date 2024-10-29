//This has to be in .env file
const auth_url =
  "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-2cd6b7a34b37658613acc6e94864cf6f6e6513cd4d0ed35cf88fc6ff2c4f619f&redirect_uri=http%3A%2F%2F127.0.0.1%3A5500%2Ffront%2F&response_type=code";

import { handleLogin } from "../functions/loginPage/handleLogin.js";

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
        `;

  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  document.getElementById("loginWith42").addEventListener("click", () => {
    window.location.href = auth_url; // Redirect to 42's OAuth page
  });
  document.getElementById("signupButton").addEventListener("click", () => {
    window.location.hash = "signup";
  });
}