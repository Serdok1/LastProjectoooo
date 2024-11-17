export function game_tournament(appElement) {
    // Define the HTML content for the game interface
    const gameHTML = `
        <h1>Pong Game - Local Tournament</h1>
        
        <!-- Oyuncu isimlerini almak için form -->
        <form id="playerForm">
            <label for="player1">Player 1 Name:</label>
            <input type="text" id="player1" name="player1" required><br><br>

            <label for="player2">Player 2 Name:</label>
            <input type="text" id="player2" name="player2" required><br><br>

            <label for="player3">Player 3 Name:</label>
            <input type="text" id="player3" name="player3" required><br><br>

            <label for="player4">Player 4 Name:</label>
            <input type="text" id="player4" name="player4" required><br><br>

            <button type="submit">Start Tournament</button>
        </form>

        <!-- Oyun alanı ve kontroller -->
        <canvas></canvas>
        <p class="hidden" id="instructions">
            <strong>Player 1:</strong> W (yukarı) ve S (aşağı) tuşlarını kullanın<br>
            <strong>Player 2:</strong> Yukarı ve Aşağı ok tuşlarını kullanın
        </p>
        <script src="./script.js"></script>
    `;

    // Insert the HTML content into the provided appElement
    appElement.innerHTML = gameHTML;

    // Formu işleyip oyunu başlatan JS kısmı
    document.getElementById('playerForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Oyuncu isimlerini al
        const player1Name = document.getElementById('player1').value;
        const player2Name = document.getElementById('player2').value;
        const player3Name = document.getElementById('player3').value;
        const player4Name = document.getElementById('player4').value;

        // Oyuncu isimlerini localStorage'a kaydet
        localStorage.setItem('players', JSON.stringify([player1Name, player2Name, player3Name, player4Name]));

        // Formu gizle ve canvas'ı göster
        document.getElementById('playerForm').classList.add('hidden');
        document.querySelector('canvas').classList.remove('hidden');
        document.getElementById('instructions').classList.remove('hidden');

        // JavaScript dosyasını çağırarak oyunu başlat
        // Bu noktada oyuncu isimlerini JS dosyasına göndermemiz gerek
        startGame();
    });

    // Oyun başlatma fonksiyonu
    function startGame() {
        const players = JSON.parse(localStorage.getItem('players'));
        console.log('Oyuncular:', players);  // Konsola oyuncu isimlerini basıyoruz, bunu JS ile oyuna entegre edeceğiz.
        Pong.initialize();  // Pong oyununu başlat
    }
    const script = document.createElement("script");
    script.src = "./game/tournament/tournament_script.js";
    document.body.appendChild(script);
}