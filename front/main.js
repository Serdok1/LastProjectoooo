import { loadLoginPage } from "./views/loginPage.js";
import { loadHomePage } from "./views/homePage.js";
import { loadProfilePage } from "./views/profilePage.js";
import { loadSocialPage } from "./views/socialPage.js";
import { isUserAuthenticated } from "./utils/tokenFuncs.js";
import { getOauthUser } from "./utils/tokenFuncs.js";
import { loadSignupPage } from "./views/signupPage.js";

document.addEventListener("DOMContentLoaded", () => {
  const appElement = document.getElementById("app");
  const routes = {
    home: () => loadHomePage(appElement),
    profile: () => loadProfilePage(appElement),
    social: () => loadSocialPage(appElement),
    login: () => loadLoginPage(appElement),
    signup: () => loadSignupPage(appElement),
  };
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (code) {
    localStorage.setItem("oauth_token", code);
    fetch("http://127.0.0.1:8000/auth-work/exchange_token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "code": code }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Token exchange failed");
      }
      return response.json();
    }).then((data) => {
      localStorage.setItem("oauth_access_token", data.access_token);
      localStorage.setItem("oauth_refresh_token", data.refresh_token);1
  })
  .then(() => {
    getOauthUser();
  })
}

  async function checkRouteAndLoadPage() {
    const routeName = window.location.hash.substring(1) || "home";

    if (!(await isUserAuthenticated()) && (routeName !== "login" && routeName !== "signup")) {
      window.location.hash = "login";
      return;
    }

    loadPage(routeName);
  }

  window.addEventListener("hashchange", checkRouteAndLoadPage);
  checkRouteAndLoadPage();

  function loadPage(routeName) {
    const pageLoader = routes[routeName];
    if (pageLoader) {
      pageLoader();
    } else {
      loadHomePage();
    }
  }
});
