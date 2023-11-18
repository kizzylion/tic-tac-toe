
 //Load x and o images for canvas
 const xImage = new Image();
 xImage.src = "img/X.png";
 const oImage = new Image();
 oImage.src = "img/O.png";

//Gameboard

function init(players, opponent, startingPlayer){

    let board =[];
    const column = 3;
    const row =3;
    const spaceSize =  150;
    let GAME_OVER = false;
    
    //  STORE PLAYER MOVES
    let playerMoves=["","","","","","","","",""];

    // Current player by default is man
    let currentPlayer = startingPlayer;
    turn.textContent = `Turn: It is Player ${currentPlayer}'s turn`;

   

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
                ctx.strokeStyle = "#00000030";
                ctx.strokeRect(i*spaceSize, j*spaceSize, spaceSize,spaceSize);
            }
        }
    }
    drawboard()

    // check if the opponent is computer and the selected symbol is "O"
    // If the above condition is true, the computer starts
    if (opponent === "computer" && currentPlayer === players.computer) {
        // Perform the computer's first move logic here
        // For example, you can call a function to make the computer move
        let space = makeComputerMove();

        
        
        drawOnBoard(currentPlayer, space.j, space.i);
        
        currentPlayer = players.man;
        console.log(playerMoves)
    }

    function makeComputerMove() {
        // Add your logic for the computer's move here
        // This is a placeholder, you need to implement your actual logic
        // For example, you can use your existing minimax algorithm
        let computerMoveId = id = minimax(playerMoves, players.computer).id;
        console.log(id)

        // store the player's move to gameData
        playerMoves[id] = players.computer;
        
        return getIJ(computerMoveId);
        

        // Continue with the rest of the game logic as needed
    }

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

        if(opponent == "computer"){
            //Get the id of the space using minimax algorithm
            id = minimax(playerMoves, players.computer).id;

            // store the player's move to gameData
            playerMoves[id] = players.computer;
            
            //get i and j of the space
            let space = getIJ(id)
            
            // Draw on the board
            console.log(id, playerMoves);
            drawOnBoard(players.computer,space.j, space.i);

            // check if he is winner
            
            if(isWinner(players.computer, playerMoves)){
                showGameOver(players.computer);
                GAME_OVER = true;
                return;
            }

            // //check if its tie game
            if(isTie(playerMoves)){
                showGameOver("tie");
                GAME_OVER = true;
                return;
            }
        }else{
            currentPlayer = currentPlayer == players.man ? players.human : players.man;
            turn.textContent = `Turn: It is Player ${currentPlayer}'s turn`;
        }
       
        // Switch the current player and update the players turn
        

        
    })

    //Minimax function
    function minimax(playerMoves, player){
        // Base
        if(isWinner(players.man, playerMoves)){
            return {evaluation : -10};
        }
        if(isWinner(players.computer, playerMoves)){
            return {evaluation : 10};
        }
        if(isTie(playerMoves)){
            return {evaluation : 0};
        }

        //Look for empty spaces
        let availSpots = getEmptySpaces(playerMoves);
        
        // save all moves and their evaluation
        let moves = [];

        //loop over the empty spaces to evaluate them
        for (let i = 0; i < availSpots.length; i++) {
            // Perform evaluation logic for each empty space
            // ...
            // Get the id of the empty space
            let id = availSpots[i];

            //Back up the space
            let backup = playerMoves[id];

            // Make the move
            playerMoves[id] = player;

            //save the move'S ID and evaluation
            let move = {};
            move.id = id;

            //The move evaluation
            if(player == players.computer){
                move.evaluation = minimax(playerMoves, players.man).evaluation;
            }else{
                move.evaluation = minimax(playerMoves, players.computer).evaluation;
            }

            //restore space
            playerMoves[id] = backup;

            //Add the move to the list
            moves.push(move);
        }

        // Find the best move
        let bestMove;
        let bestScore = -Infinity;

        if(player == players.computer){
            bestEvaluation = -Infinity;
            for(let i = 0; i < moves.length; i++){
                if(moves[i].evaluation > bestEvaluation){
                    bestEvaluation = moves[i].evaluation;
                    bestMove = moves[i];
                }
            }
        }else{
            bestEvaluation = Infinity;
            for(let i = 0; i < moves.length; i++){
                if(moves[i].evaluation < bestEvaluation){
                    bestEvaluation = moves[i].evaluation;
                    bestMove = moves[i];
                }
            }
        }

        return bestMove
    }

    //GET EMPTY SPACES
    function getEmptySpaces(playerMoves){
        let emptySpaces = [];
        for (let i=0; i<playerMoves.length ; i++){
            if(!playerMoves[i]){
                emptySpaces.push(i);
            }
        }
        return emptySpaces;
    }
    

    //GET ID(I and J) OF THE SPACE
    function getIJ(id){
        for(let i=0; i<board.length; i++){
            for(let j=0; j<board[i].length; j++){
                if(board[i][j] == id){
                    return {i,j}
                }
            }
        }
    }

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
            <div class="container" style ="margin-top:calc(100vh - 80vh)"> 
                <h1 > ${message} </h1>
                <img class="winnerImg" width = "150px" height = "150px" src="${imgSrc}" alt="">
                <div class="replay btn" style ="margin-top: 20px" onclick = "location.reload()"> Play Again</div>

            </div>
        `;
        document.body.style.overflow = 'hidden';
        optionScreen().gameOverElement.classList.remove('hide');

    }


    // draw player sign on the canvas position clicked
    function drawOnBoard(player, i, j){
        // take in the player, position row and column position clicked,
        // then we will draw a circle or an x depending on who's turn it is
        const img = player == "X"? xImage : oImage;
        ctx.drawImage(img, i*spaceSize, j*spaceSize,spaceSize, spaceSize)
    }

}

const gameSettings = optionScreen();