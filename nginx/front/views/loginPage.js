//This has to be in .env file
const auth_url =
  "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-2cd6b7a34b37658613acc6e94864cf6f6e6513cd4d0ed35cf88fc6ff2c4f619f&redirect_uri=http%3A%2F%2F127.0.0.1%3A5500%2Ffront%2F&response_type=code";

import { handleLogin } from "../functions/loginPage/handleLogin.js";

export function loadLoginPage(appElement) {
  appElement.innerHTML = `
  <link rel="stylesheet" href="styles/loginPage.css">
          <body>
          <div id="container">
            <div id="background-shapes">
              <div class="shape shape-top-left"></div>
              <div class="shape shape-bottom-left"></div>
              <div class="shape shape-circle-left"></div>
              <div class="shape shape-circle-right"></div>
            </div>
            <form id="loginForm">
                <input id="form-input-user" class="form-input" type="text" placeholder="Username" required>
                <input type="password" id="form-input-pass" class="form-input" placeholder="Password" required>
                <button type="submit" class="" id="submit-button">Login</button>
              </form>
              <div id="rightArea">
                <div id="loginWith">
                  <div id="pArea">
                    <p id="big-text">You can log in with your 42 credentials.</p>
                    <p id="small-text" >*You will be redirected to 42’s authorization page</p>
                  </div>
                  <button id="loginWith42" >Login with 42</button>
                </div>
                <div id="signupArea">
                  <p id="big-text" >if you still dont have an account yet you can create one ! </p>
                  <button id="signupButton">Create one</button>
                </div>
              </div>
            </div>
          </body>
        `;

  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  document.getElementById("loginWith42").addEventListener("click", () => {
    window.location.href = auth_url; // Redirect to 42's OAuth page
  });
  document.getElementById("signupButton").addEventListener("click", () => {
    window.location.hash = "signup";
  });
}
