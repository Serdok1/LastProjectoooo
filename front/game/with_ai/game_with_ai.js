
export function game_with_ai(appElement) {
    appElement.innerHTML = `
    <style>
    @import url('httpsL//fonts.googleapis.com/css2?family=Poppins&display=swap');
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
        <p>Control the left player by using up and down arrow keys</p>
        <script src="./script.js"></script>
    </div>
`;

const script = document.createElement("script");
script.src = "./game/with_ai/script.js";
document.body.appendChild(script);
}