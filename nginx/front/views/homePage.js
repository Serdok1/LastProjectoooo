import tr_lang from '../languages/tr_lang.js';
import { game_with_ai } from '../game/with_ai/game_with_ai.js';
import { local_match } from '../game/local_match/local_match.js';
import { game_tournament } from '../game/tournament/tournament.js';

export function loadHomePage(appElement) {
  const welcomeMessage = tr_lang.messages.welcome_back.replace("{username}", localStorage.getItem("username"));

  // Set up the HTML structure with a container for buttons and a content area
  appElement.innerHTML = `
    <h1>${tr_lang.navigation.home}</h1>
    <p>${welcomeMessage}</p>
    <style>
      #button-container {
        display: flex;
        justify-content: center;
        gap: 15px;
      }
      #content-area {
        margin-top: 20px;
      }
      button {
        padding: 8px;
        font-size: 16px;
        cursor: pointer;
        background-color: #D1BFFA;
        border-radius: 15px;
        border: none;
        box-shadow: 0 0 5px gray;
      }
      button:hover {
        background-color: #A370F2;
      }
    </style>
    <div id="button-container">
      <button id="game_with_ai_btn">Game with AI</button>
      <button id="local_match_btn">Local Match</button>
      <button id="game_tournament_btn">Game Tournament</button>
    </div>
    <div id="content-area">
      <!-- Content for each game will be displayed here -->
    </div>
  `;

  const contentArea = document.getElementById("content-area");

  // Add event listeners to each button to load the respective game into the content area
  document.getElementById('game_with_ai_btn').addEventListener('click', function () {
    contentArea.innerHTML = "";  // Clear content area before loading new content
    game_with_ai(contentArea);
  });

  document.getElementById('local_match_btn').addEventListener('click', function () {
    contentArea.innerHTML = "";  // Clear content area before loading new content
    local_match(contentArea);
  });

  document.getElementById('game_tournament_btn').addEventListener('click', function () {
    contentArea.innerHTML = "";  // Clear content area before loading new content
    game_tournament(contentArea);
  });
}
