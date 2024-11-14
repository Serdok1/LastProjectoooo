
export function game_with_ai(appElement) {
    appElement.innerHTML = `
    <style>
    @import url('httpsL//fonts.googleapis.com/css2?family=Poppins&display=swap');
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
        <script src="./script.js"></script>
    </div>
`;

const script = document.createElement("script");
script.src = "./game/with_ai/script.js";
document.body.appendChild(script);
}