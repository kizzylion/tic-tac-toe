

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
    const setCellValue = (rowIndex, columnIndex, player) =>{
        const availableCell = board;
        
        // if(!availableCell.forEach(rows => rows.filter(columns => columns.getValue() === ""))) return;
        if(availableCell[rowIndex][columnIndex].getValue() !== "") return;
        availableCell[rowIndex][columnIndex].addToken(player);
        // console.log(availableCell.getValue)
    }

    const resetBoard = () => {
        board.forEach((rows)=> rows.forEach(columns => columns.resetToken()));
    }

    const printBoard = () => {
        const boardWithCellValue = board.map(rows => rows.map((columns) => columns.getValue()) );
        console.log(boardWithCellValue);
    };

    return {
        getBoard,
        setCellValue,
        printBoard,
        resetBoard
    };
})()

gameBoard.printBoard();
gameBoard.setCellValue(0,2, {
    name: 'playerOneName',
    token: 'X'
})
gameBoard.setCellValue(0,2, {
    name: 'playerOneName',
    token: 'O'
})
gameBoard.printBoard();


gameBoard.resetBoard()
gameBoard.printBoard()