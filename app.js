

(cell = () =>{
    let value = "";
    
    const addToken = (player)=>{
        return value = player.token;
    }
    
    const getValue = () => value;

    const resetToken = () => {
        return value = "";
    }
    
    return{
        addToken,
        getValue,
        resetToken
    }
})();

const gameBoard = (()=> {
    const rows = 3;
    const columns = 3;
    let board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for(let j = 0; j < columns; j++){
            board[i].push(cell());
        }
    }

    const getBoard = () => { return board };
    function isBoardFull() {
        const boardData = board;
        for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
            for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
                if (boardData[rowIndex][columnIndex].getValue() === "") {
                    console.log('false')
                    return false; // If any cell is unoccupied, return false
                }
            }
        }
        
        return true; // All cells are occupied
    }

    const isCellOccupied =(rowIndex,columnIndex) =>{
        return board[rowIndex][columnIndex].getValue() !== "";
    }
    
    const setCellValue = (rowIndex, columnIndex, player) =>{
        const availableCell = board;
        availableCell[rowIndex][columnIndex].addToken(player);
        console.log(availableCell[rowIndex][columnIndex].getValue())
    }

    const resetBoard = () => {
        board.forEach((rows)=> rows.forEach(columns => columns.resetToken()));
        printBoard();
        console.log(`Board Restarted`)
    }

    const printBoard = () => {
        const boardWithCellValue = board.map(rows => rows.map((columns) => columns.getValue()) );
        console.table(boardWithCellValue);
    };

    return {
        getBoard,
        isBoardFull,
        isCellOccupied,
        setCellValue,
        printBoard,
        resetBoard
    };
})()

const gameController = (playerOneName = 'Player One', playerTwoName = 'Player Two') => {
    const board = gameBoard;

    const players = [
        playerOne = {
            name : playerOneName,
            token : 'X'
        },
        playerTwo = {
            name : playerTwoName,
            token : 'O'
        }
    ];

    let activePlayer = players[0];

    const switchPlayer =  () =>{
        activePlayer = activePlayer === players[0]? players[1]: players[0];
    }

    const getActivePlayer = () => activePlayer;

    const resetActivePlayer = () => activePlayer = players[0];

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s Turn...`)
    }

    const playRound = (rowIndex, columnIndex) => {
        printNewRound();
        if(board.isBoardFull()) {
            const draw = () => {
                return {
                    congratulation : `No winner, A DRAW`,
                    status:"draw"
                }
            }
            screenController().endgame(draw())
            return
        };
        if(board.isCellOccupied(rowIndex,columnIndex)) return;

        board.setCellValue(rowIndex, columnIndex, getActivePlayer());
        
        //this is where we check the for winner
        if(!checkForWinner()){
            switchPlayer();
            printNewRound();
        }
        else{
            // console.log(`${getActivePlayer().name} Won!`)
            const winner = () => {
                return {
                    winnerName : getActivePlayer().name,
                    congratulation : `${getActivePlayer().name} Won!`,
                    status:"won"
                }
            }
            screenController().endgame(winner())
                
        }
    }
    function checkForWinner() {
        console.log('Checking for winner...');
        console.log('Checking row winning sequence...');
        if (checkRowWinningSequence('X') || checkRowWinningSequence('O') ) {
            console.log('Row winning sequence found!');
            return true;
        }
        console.log('Checking column winning sequence...');
        if (checkColumnWinningSequence('X') || checkColumnWinningSequence('O')) {
            console.log('Column winning sequence found!');
            return true;
        }
        console.log('Checking diagonal winning sequence...');
        if (checkDiagonalWinningSequence('X') || checkDiagonalWinningSequence('O')) {
            console.log('Diagonal winning sequence found!');
            return true;
        }
        console.log('No winning sequence found.');
        return false;
    }

    function checkRowWinningSequence(winningSequence) {
        const boardData = board.getBoard();
        for (let rowIndex = 0; rowIndex < boardData.length; rowIndex++) {
            const row = boardData[rowIndex];
            if (row.every(cell => cell.getValue() === winningSequence)) {
                return true;
            }
        }
        return false;
    }
    function checkColumnWinningSequence(winningSequence) {
        const boardData = board.getBoard();
        for (let columnIndex = 0; columnIndex < boardData[0].length; columnIndex++) {
            const column = [];
            for (let rowIndex = 0; rowIndex < boardData.length; rowIndex++) {
                column.push(boardData[rowIndex][columnIndex].getValue());
            }
            if (column.every(cellValue => cellValue === winningSequence)) {
                return true;
            }
        }
        return false;
    }
    function checkDiagonalWinningSequence(winningSequence) {
        const boardData = board.getBoard();
        const diagonal1 = [];
        const diagonal2 = [];
        
        for (let i = 0; i < boardData.length; i++) {
            diagonal1.push(boardData[i][i].getValue());
            diagonal2.push(boardData[i][boardData.length - 1 - i].getValue());
        }
        
        if (diagonal1.every(cellValue => cellValue === winningSequence) ||
            diagonal2.every(cellValue => cellValue === winningSequence)) {
            return true;
        }
        
        return false;
    }


    
    printNewRound();

    return{
        getActivePlayer,
        resetActivePlayer,
        getBoard: board.getBoard,
        playRound
    }

}

const screenController = () => {
    const game = gameController();
    

    const playerTurnsDiv = document.getElementById('turn');
    const resetBtn = document.getElementById('resetBtn');
    const boardDiv = document.getElementById('board');

    const updateScreen = ()=> {
        boardDiv.textContent = "";

        //Get the latest version of the board and player turn
        playerTurnsDiv.textContent = `${game.getActivePlayer().name}'s Turn`;
        const board = game.getBoard();

        // Render Game value
        board.forEach((rows, index) => {
            let rIndex = index;
            rows.forEach((columns, index) => {
                let cIndex = index
                const cellBtn = document.createElement('button');
                cellBtn.classList.add('cell');
                cellBtn.textContent = columns.getValue();
                cellBtn.id =`${rIndex}${cIndex}`;
                // add click event to cell
                cellBtn.addEventListener("click", clickHandlerBtn);
                boardDiv.appendChild(cellBtn);
            })
        })
    }

    resetBtn.addEventListener('click', resetGame)

    /**
     * Handles the click event on the cell button.
     */
    function clickHandlerBtn(e) {
    // Get the cell index from the clicked button's id
    const cellIndex = e.target.id;

    // Get the row index from the cell index
    const rowIndex = cellIndex[0];

    // Get the column index from the cell index
    const columnIndex = cellIndex[1];

    // Call the game's playRound method with the row and column indices
    game.playRound(rowIndex, columnIndex);
    if(gameBoard.isBoardFull()) {
        const draw = () => {
            return {
                congratulation : `No winner, A DRAW`,
                status:"draw"
            }
        }
        screenController().endgame(draw())
        return
    };
    updateScreen()
    }


    // Handles the click event on the resetButton
    function resetGame () {
        gameBoard.resetBoard();
        game.resetActivePlayer();
        updateScreen();
    }

    const endgame = (result) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('endgame-message');
        
        const messageText = document.createElement('p');
        
        if (result.status === 'draw') {
            messageText.textContent = "It's a draw!";
        } else {
            messageText.textContent = result.congratulation;
        }
        
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart Game';
        restartButton.addEventListener('click', () => {
            gameBoard.resetBoard();
            gameController().resetActivePlayer();
            updateScreen();
            messageDiv.remove();
        });
        
        messageDiv.appendChild(messageText);
        messageDiv.appendChild(restartButton);
        
        document.body.appendChild(messageDiv);
    };


    updateScreen()

    return {endgame}

}



screenController()