export function game_with_ai(appElement) {
    // Function to clean up the game view
    function cleanupGame() {
      appElement.innerHTML = ""; // Clear the game content
      const gameScript = document.getElementById("game-script");
      if (gameScript) {
        gameScript.remove(); // Remove the script from the DOM
      }
    }
  
    // Initial setup for the game
    appElement.innerHTML = `
      <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
      * {
          font-family: 'Poppins', sans-serif;
      }
      #body {
          text-align: center;
          background-color: #A381F2;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 80%;
          flex-direction: column;
          width: 100%;
          margin-top: 10%;
      }
      </style>
      <div id="body">
          <canvas></canvas>
          <p>Control the left player by using up and down arrow keys</p>
      </div>
    `;
  
    // Append the game script to the DOM and give it an ID
    const script = document.createElement("script");
    script.src = "./game/with_ai/ai_script.js";
    script.id = "game-script";
    document.body.appendChild(script);
  
    // Attach the cleanup function to other game buttons
    document.getElementById("local_match_btn").addEventListener("click", cleanupGame);
    document.getElementById("game_tournament_btn").addEventListener("click", cleanupGame);
    window.onclick = function (event) {
      document.getElementById("difficulty-buttons").style.display = "none";
      cleanupGame();
      if (event.target === document.getElementById("game")) {
      }
    }
  }
  