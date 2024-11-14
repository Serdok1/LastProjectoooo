// alertSystem.js
export const alertSystem = (function() {
    // Uyarı konteynerini otomatik olarak sayfaya ekler
    function createAlertContainer() {
      let alertContainer = document.getElementById('alert-container');
      if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alert-container';
        alertContainer.className = 'position-fixed top-0 end-0 p-3';
        alertContainer.style.zIndex = '1100';
        document.body.appendChild(alertContainer);
      }
      return alertContainer;
    }
  
    function showAlert(message, type = 'danger', timeout = 5000) {
      // Alert div'i oluştur
      const alertDiv = document.createElement('div');
      alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
      alertDiv.role = 'alert';
      alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;
  
      // Uyarıyı göster
      const alertContainer = createAlertContainer();
      alertContainer.appendChild(alertDiv);
  
      // Belirtilen süre sonunda uyarıyı kaldır
      setTimeout(() => {
        alertDiv.classList.remove('show');
        alertDiv.classList.add('hide');
        setTimeout(() => alertDiv.remove(), 500); // Animasyonun bitmesini bekler
      }, timeout);
    }
  
    return {
      showAlert
    };
  })();