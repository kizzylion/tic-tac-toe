

//Gameboard

function init(players, opponent){

    let board =[];
    const column = 3;
    const row =3;
    const spaceSize =  150;
    let GAME_OVER = false;
    
    //  STORE PLAYER MOVES
    let playerMoves=["","","","","","","","",""];

    // Current player by default is man
    let currentPlayer = players.man;
    turn.textContent = `Turn: It is Player ${currentPlayer}'s turn`;

    //Load x and o images for canvas
    const xImage = new Image();
    xImage.src = "./img/X.png";
    const oImage = new Image();
    oImage.src = "./img/O.png";

    const winConditions = [
        
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,4,8],
        [2,4,6]
    ]

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

        if(GAME_OVER) return;
        // X & Y position of mouse click relative to the canvas
        // event.client show the click position relative to the viewPort
        // cvs.getBoundaringClientRec show the position of the canvas in the view port.

        let X =  event.clientX - cvs.getBoundingClientRect().x;
        let Y = event. clientY - cvs.getBoundingClientRect().y;
        
        // WE CALCULATED i & j of the clicked canvas
        let i = Math.floor(X/spaceSize) ;
        let j = Math.floor(Y/spaceSize) ;

        // Get the id of the position the player clicked
        id = board[j][i];

        // Prevent the player from playing the space if its not empty
        if(playerMoves[id]) return;
        // Store the players move to game data.
        playerMoves[id] = currentPlayer;
        console.log(id, playerMoves);
        drawOnBoard(currentPlayer,i,j);

        // check if he is winner
        
        if(isWinner(currentPlayer, playerMoves)){
            showGameOver(currentPlayer);
            GAME_OVER = true;
            return;
        }

        // //check if its tie game
        if(isTie(playerMoves)){
            showGameOver("tie");
            GAME_OVER = true;
            return;
        }
       
        // Switch the current player and update the players turn
        currentPlayer = currentPlayer == players.man ? players.computer : players.man;
        turn.textContent = `Turn: It is Player ${currentPlayer}'s turn`;

        
        function isWinner(player, playerMoves){
            
            for(let k=0; k < winConditions.length; k++){
            
                let won = true;
                for(let l=0; l<winConditions[k].length; l++){
                    let id = winConditions[k][l];
                    won = playerMoves[id] == player && won;
                }
                if(won){
                    return true;
                };
            }
            
            return false;
        }

        function isTie(playerMoves){
            let isBoardfull = true;

            for(let i=0; i < playerMoves.length; i++){
                isBoardfull = playerMoves[i] && isBoardfull;
            }

            if(isBoardfull) return true;
            else return false;
        }

        function showGameOver(player){
            let message = player == "tie" ? 'no winner' : "The winner is"
            let imgSrc = `img/${player}.png`;

            optionScreen().gameOverElement.innerHTML = `
                <h1 style ="margin-top:calc(100vh - 90vh)"> ${message} </h1>
                <img class="winnerImg" width = "150px" height = "150px" src="${imgSrc}" alt="">
                <div class="replay btn" style ="margin-top: 20px" onclick = "location.reload()"> Play Again</div>
            `;
            document.body.style.overflow = 'hidden';
            optionScreen().gameOverElement.classList.remove('hide');

        }
    })
    // draw player sign on the canvas position clicked
    function drawOnBoard(player, i, j){
        // take in the player, position row and column position clicked,
        // then we will draw a circle or an x depending on who's turn it is
        const img = player == "X"? xImage : oImage;
        ctx.drawImage(img, i*spaceSize, j*spaceSize,spaceSize, spaceSize)
    }

}

const gameSettings = optionScreen();