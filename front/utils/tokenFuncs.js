export async function isUserAuthenticated() {
  const access_token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");
  if (!access_token) {
    return false;
  }

  const response = await fetch(
    "http://127.0.0.1:8000/auth-work/token/verify/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${access_token}`,
      },
      body: JSON.stringify({ token: access_token }),
    }
  );

  if (!response.ok) {
    const refresh = await fetch("http://127.0.0.1:8000/auth-work/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${access_token}`,
      },
      body: JSON.stringify({ refresh: refresh_token }),
      
    })
    .then((response) => {
      if (!response.ok) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.hash = "login";
          console.log(response);
          throw new Error("Token refresh failed");
        }
        return false;
      })
      .then((data) => {
        localStorage.setItem("access_token", refresh.access);
        localStorage.setItem("refresh_token", refresh.refresh);
      });
  }

  return true;
}

export async function getOauthUser() {
  await fetch("http://127.0.0.1:8000/auth-work/login_with_oauth/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ oauth_access_token: localStorage.getItem("oauth_access_token") }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error getting user data");
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("user_secret", data.secret_key);
      //clear url params
      window.history.replaceState({}, document.title, "/" + "front/");
      window.location.hash = "home";
    })
    .catch((error) => {
      console.error("Error during login:", error);
    });
}
