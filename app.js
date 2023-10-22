

//Gameboard

function init(players, opponent){

    let board =[];
    const column = 3;
    const row =3;
    const spaceSize =  150;

    //drawboard
    function drawboard(){

        for(let i = 0; i<row; i++){
            board[i] = [];
            for (let j = 0; j < column; j++){
                board[i][j] = 
                ctx.strokeStyle = "#000";
                ctx.strokeRect(i * spaceSize,j * spaceSize,spaceSize,spaceSize);
    
            }
        }
    }
    drawboard()
}

const gameSettings = optionScreen()