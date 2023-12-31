

let cvs = document.getElementById('cvs');
let  ctx = cvs.getContext('2d');
let title = document.querySelector(".title")
let turn = document.querySelector(".turn")
    
   

const optionScreen = () => {
    // SELECT ELEMENTS
    const options = document.querySelector(".options");
    const gameOverElement = document.querySelector(".gameover");

    //SELECT BUTTONS
    const computerBtn = document.querySelector(".computer");
    const humanBtn = document.querySelector(".human");
    const xBtn = document.querySelector(".x");
    const oBtn = document.querySelector(".o");
    const playBtn = document.querySelector(".play");
    
    let opponent;
    let players = {};

    // Switch buttons
    const switchActive = (off, on) =>{
        off.classList.remove("active");
        on.classList.add("active");
    }

    const computerOpponent = () => {
        humanBtn.style.backgroundColor = "";
        switchActive(humanBtn,computerBtn)
        return opponent = "computer";
    }

    const humanOpponent = () => {
        computerBtn.style.backgroundColor = "";
        switchActive(computerBtn, humanBtn)
        
        return opponent = "human";
    }

    const xToken = () => {
        oBtn.style.backgroundColor = "";
        switchActive(oBtn, xBtn);
    
        players.man = "X";
        players.computer = "O";
        players.human = "O";
    }
    const oToken = () => {
        xBtn.style.backgroundColor = "";
        switchActive(xBtn, oBtn)
        
        players.man = "O";
        players.computer = "X";
        players.human = "X";

    }
    
    computerBtn.addEventListener("click", computerOpponent)
    humanBtn.addEventListener("click", humanOpponent )
    oBtn.addEventListener("click", oToken)
    xBtn.addEventListener("click", xToken)
    
    playBtn.addEventListener("click", function(){
        
        if(!opponent){
            computerBtn.style.backgroundColor = "red";
            // computerBtn.style.color = "white";
            humanBtn.style.backgroundColor = "red";
            // humanBtn.style.color = "white";
            return
        }
        if(!players.man){
            oBtn.style.backgroundColor = "red";
            // oBtn.style.color = "white";
            xBtn.style.backgroundColor = "red";
            // xBtn.style.color = "white";
            return
        }
        
        // Check if the player chose "O" and set the starting player accordingly
        if (players.man === "O") {
            init(players, opponent, players.computer); // Start with computer if player chose "O"
        } else {
            init(players, opponent, players.man); // Start with player if player chose "X"
        }
        cvs.classList.toggle("hide")
        title.classList.toggle("hide")
        turn.classList.toggle("hide")
        options.classList.toggle("hide")

    })
    

    const getOpponent = () => {
        return opponent
    }
    const getPlayers = () => {
        return players
    }

    return {
        getOpponent,
        getPlayers,
        gameOverElement
    }

}
