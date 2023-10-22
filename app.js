

//Gameboard

function init(players, opponent){

    let board =[];
    const column = 3;
    const row =3;
    const spaceSize =  150;

    
    //  STORE PLAYER MOVES
    let playerMoves=["","","","","","","","",""];

    // Current player by default is man
    let currentPlayer = players.man;
    turn.textContent = `Turn: It is Player ${currentPlayer}'s turn`;

    //DRAW THE BOARD
    function drawboard(){
        // WE give every space a unique id
        let id = 0;
        // So that when i click on a space, i know the space i clicked on.
        

        for(let i = 0; i<row; i++){
            board[i] = [];
            for (let j = 0; j < column; j++){
                // Set and id for ever space
                board[i][j] = id;
                id++;

                // draw the space
                ctx.strokeStyle = "#000";
                ctx.strokeRect(i * spaceSize,j * spaceSize,spaceSize,spaceSize);
            }
        }
    }
    drawboard()

    // ON PLAYER CLICK 
    cvs.addEventListener("click", function(event){

        // X & Y position of mouse click relative to the canvas
        // event.client show the click position relative to the viewPort
        // cvs.getBoundaringClientRec show the position of the canvas in the view port.

        let X =  event.clientX - cvs.getBoundingClientRect().x;
        let Y = event. clientY - cvs.getBoundingClientRect().y;
        
        // WE CALCULATED i & j of the clicked canvas
        let i = Math.floor(X/spaceSize) ;
        let j = Math.floor(Y/spaceSize) ;

        // Get the of the position the player clicked
        id = board[i][j];

        // Prevent the player from playing the space if its not empty
        if(playerMoves[id]) return;
        // Store the players move to game data.
        playerMoves[id] = currentPlayer;
        console.log(id, playerMoves);

        // Switch the current player and update the players turn
        currentPlayer = currentPlayer == players.man ? players.computer : players.man;
        turn.textContent = `Turn: It is Player ${currentPlayer}'s turn`;
    })


}

const gameSettings = optionScreen()