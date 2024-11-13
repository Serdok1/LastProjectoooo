import { alertSystem } from "../../utils/alertSystem.js";

// Form gönderme işlemini yönetme fonksiyonu
export async function handleFormSubmit(event, profilePictureInput) {
  event.preventDefault();

  const formData = new FormData();
  formData.append("username", document.getElementById("username").value);
  formData.append("email", document.getElementById("email").value);
  formData.append("password", document.getElementById("password").value);

  if (profilePictureInput.files[0]) {
    formData.append("profile_picture", profilePictureInput.files[0]);
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/auth-work/signup/", {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) throw new Error("Signup failed");

    const data = await response.json();
    console.log("Signup successful!");
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    localStorage.setItem("username", formData.get("username"));
    window.location.hash = "home";
  } catch (error) {
    console.error("Error during signup:", error);
    alertSystem.showAlert("An error occurred during signup: " + error.message);
  }
}
