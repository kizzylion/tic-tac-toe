

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
    const isBoardFull = () => {
        return board.every(rows => rows.every(columns => columns.getValue() !== ""));
    };

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
        if(board.isBoardFull()) return;
        if(board.isCellOccupied(rowIndex,columnIndex)) return;

        board.setCellValue(rowIndex, columnIndex, getActivePlayer());
        
        //this is where we check the for winner
        switchPlayer();
        printNewRound();

       
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
    updateScreen()
    }

    // Handles the click event on the resetButton
    function resetGame () {
        gameBoard.resetBoard();
        game.resetActivePlayer();
        updateScreen();
    }

    updateScreen()

}

screenController()