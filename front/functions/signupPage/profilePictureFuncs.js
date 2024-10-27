// Varsayılan profil resmini yükleme fonksiyonu
export async function loadDefaultProfilePicture(profilePictureElement) {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/user-manage/get_default_pp/",
      {
        method: "GET",
      }
    );
    if (!response.ok) throw new Error("Failed to get default profile picture");

    const blob = await response.blob();
    profilePictureElement.src = URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error getting default profile picture:", error);
  }
}

// Profil resmini önizleme fonksiyonu
export function previewProfilePicture(profilePictureInput, profilePictureElement) {
  const file = profilePictureInput.files[0];
  if (file) {
    profilePictureElement.src = URL.createObjectURL(file);
  }
}
