export function local_match(appElement) {
  appElement.innerHTML = `
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        * {
            font-family: 'Poppins', sans-serif;
        }
        #body {
            text-align: center;
            background-color: ghostwhite;
            display: flex;
            justify-content: center;
            align-items: center; 
            height: 100vh;
            flex-direction: column;
            position: fixed;
            width: 100%;
        }
    </style>
    <div id="body">
        <h1>Pong Game</h1>
        <canvas></canvas>
        <p>
            <strong>Player 1:</strong> W (yukarı) ve S (aşağı) tuşlarını kullanın<br>
            <strong>Player 2:</strong> Yukarı ve Aşağı ok tuşlarını kullanın
        </p>
        <script src="./script.js"></script>
    </div id="body">
`;
  const script = document.createElement("script");
  script.src = "./game/local_match/script.js";
  document.body.appendChild(script);
}
