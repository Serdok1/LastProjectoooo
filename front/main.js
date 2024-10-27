import { loadLoginPage } from "./views/loginPage.js";
import { loadHomePage } from "./views/homePage.js";
import { loadProfilePage } from "./views/profilePage.js";
import { loadSocialPage } from "./views/socialPage.js";
import { isUserAuthenticated } from "./utils/tokenFuncs.js";
import { getOauthUser } from "./utils/tokenFuncs.js";
import { loadSignupPage } from "./views/signupPage.js";
import { webSocket } from "./utils/webSocket.js";

document.addEventListener("DOMContentLoaded", async () => {
  const appElement = document.getElementById("app");

  // Rota tanımları
  const routes = {
    home: () => loadHomePage(appElement),
    profile: () => loadProfilePage(appElement),
    social: () => loadSocialPage(appElement),
    login: () => loadLoginPage(appElement),
    signup: () => loadSignupPage(appElement),
  };

  // OAuth token değişimi
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (code) {
    localStorage.setItem("oauth_token", code);
    try {
      const response = await fetch("http://127.0.0.1:8000/auth-work/exchange_token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) throw new Error("Token exchange failed");

      const data = await response.json();
      localStorage.setItem("oauth_access_token", data.access_token);
      localStorage.setItem("oauth_refresh_token", data.refresh_token);

      await getOauthUser();
    } catch (error) {
      console.error("Error during token exchange:", error);
      alert("Token exchange failed: " + error.message);
    }
  }

  // Rota kontrolü ve sayfa yükleme fonksiyonu
  async function checkRouteAndLoadPage() {
    const routeName = window.location.hash.substring(1) || "home";

    try {
      const authenticated = await isUserAuthenticated();
      if (!authenticated && routeName !== "login" && routeName !== "signup") {
        window.location.hash = "login";
        return;
      } else if (authenticated) {
        await webSocket();
      }
      loadPage(routeName);
    } catch (error) {
      console.error("Authentication check failed:", error);
      alert("An error occurred while checking authentication: " + error.message);
    }
  }

  // Rota değişikliklerini dinleyin
  window.addEventListener("hashchange", checkRouteAndLoadPage);

  // İlk sayfa yüklemesi
  await checkRouteAndLoadPage();

  // Sayfa yükleme fonksiyonu
  function loadPage(routeName) {
    const pageLoader = routes[routeName];
    if (pageLoader) {
      pageLoader();
    } else {
      loadHomePage(appElement);
    }
  }
});
