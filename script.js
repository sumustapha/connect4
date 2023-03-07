const gameBoard = (() => {
   let rows = 6
   let cols = 7
   let board = Array.from({length:rows}, ()=> Array(cols))
    const getBoard = function(row,col){
        return board[row][col]
    }

    const setBoard = function(row,col,chip){
        board[row][col] = chip
        //add classlist here
    }

    const clearBoard = function(){
        board = Array.from({length:rows}, () => Array(cols))
    }

    return {setBoard, getBoard, clearBoard}
})()

const player = (chip, color, score = 0) => {
    let count = 0
    this.chip = chip
    this.score = score
    this.color = color

    const getChip = () => chip
    const getColor = () => color
    const getScore = () => count
    const resetScore = () => {count = 0}
    const setScore = function (score){
        count+=score
    } 

    return {getChip, getScore, getColor, setScore, resetScore}
}

const gameController = (()=>{
    const player1 = player("player1","ff6488")
    const player2 = player("player2","fece67")
    let nextTurn = 1 //private
    let isOver = false

    const playRound = (e) => {
        let rows = 5
        let col = e.target.dataset.col
        //check column availability
        while(!isOver){
            Timer()
            for (let i = rows; i >= 0; i--) {
                //check top row to prevent overflow
                if(gameBoard.getBoard(0,col)==("player2"||"player1")) return
                //check empty col from bottom
                if(gameBoard.getBoard(i,col) == ("" || undefined)){
                    gameBoard.setBoard(i,col,gameController.getMarker())
                    slots2d[i][col].classList.add(`${gameController.getMarker()}`)
                    checkWinner(gameController.getMarker())
                    nextTurn++
                    displayController.setTurnText(gameController.getMarker(), gameController.color())
                    return
                }
            }
        }
       
    }

    const gameOver = (chip) => {
        let winner = chip == 'player1' ? player1 : player2
        if(chip != 'draw'){
            winner.setScore(1)
            displayController.incScore(winner)
            displayController.changeDisplay()
            displayController.setWinner(winner,"WINS")
        }
        else{
            displayController.changeDisplay()
            displayController.setWinner(chip,"DRAW")
        }
        isOver = true
    }

    const checkWinner = (chip) => {            
        for(let col = 0; col < 4; col ++)
        {
            for(let row = 0; row < 6; row ++){
                if((gameBoard.getBoard(row, col) == chip && gameBoard.getBoard(row, col+1) == chip && gameBoard.getBoard(row, col+2) == chip && gameBoard.getBoard(row, col+3)== chip)){
                    gameOver(chip)
                }
            }
        }

        for(let row = 0; row < 3; row ++)
        {
            for(let col = 0; col < 6; col ++){
                if((gameBoard.getBoard(row, col) == chip && gameBoard.getBoard(row+1, col) == chip && gameBoard.getBoard(row+2, col) == chip && gameBoard.getBoard(row+3, col)== chip)){
                    gameOver(chip)
                }
            }
        }

        for(let rowd = 0; rowd < 3; rowd ++)
        {
            for(let cold = 0; cold < 6; cold ++){
                if((gameBoard.getBoard(rowd, cold) == chip && gameBoard.getBoard(rowd+1, cold+1) == chip && gameBoard.getBoard(rowd+2, cold+2) == chip && gameBoard.getBoard(rowd+3, cold+3)== chip)){
                    gameOver(chip)
                }
            }
        }

        for(let rowd = 0; rowd < 3; rowd ++)
        {
            for(let cold = 0; cold < 6; cold ++){
                if((gameBoard.getBoard(rowd, cold+3) == chip && gameBoard.getBoard(rowd+1, cold+2) == chip && gameBoard.getBoard(rowd+2, cold+1) == chip && gameBoard.getBoard(rowd+3, cold)== chip)){
                    gameOver(chip)
                }
            }
        }

        if(nextTurn == 42){
            gameOver('draw')
        }

    }

    
    const getMarker = () =>  nextTurn % 2 == 1 ? player1.getChip():player2.getChip()
    const color = () =>  nextTurn % 2 == 1 ? player1.getColor():player2.getColor()
    const resetGame = () => {
        nextTurn = 1
        isOver = false
        gameBoard.clearBoard()
        slots.forEach(slot => {
            slot.classList.remove(player1.getChip())
            slot.classList.remove(player2.getChip())}
        )
    }

    const resetScores = function(){
        player1.resetScore()
        player2.resetScore()
    }

    let countDown

    function Timer(seconds=5){
        const now = Date.now()
        const then = now + seconds * 1000

        let done = false

        clearInterval(countDown)

        countDown = setInterval(()=>{
            let secondsLeft = parseInt(Math.round((then - Date.now())/1000))

            if(secondsLeft < 0) {
                clearInterval(countDown)
                return gameOver(getMarker()=='player2'?'player1':'player2')
            }
            displayController.setTimer(secondsLeft)
        },1000)
        

    }


    return {getMarker,color,playRound,resetGame,resetScores}
    

})()

const slots = document.querySelectorAll('.slots')
const slotsArray = Array.from(slots)
const slots2d= []
while(slotsArray.length) slots2d.push(slotsArray.splice(0,7))
slots.forEach(slot => slot.addEventListener('click', gameController.playRound))



const displayController = (()=>{

    const player1Dom = document.querySelector('.p1Score')
    const player2Dom = document.querySelector('.p2Score')
    const turnDisplay = document.querySelector('.turnDisplay')
    const turnText = document.querySelector('.turnText')
    const timeLeft = document.querySelector('.time')

    const winnerDisplay = document.querySelector('.winnerDisplay')
    const winner = document.querySelector('.winner')
    const wins = document.querySelector('.wins')

    const btnPlayAgain = document.getElementById('playAgain')
    btnPlayAgain.addEventListener('click', playAgain)


    const reset = document.querySelector('.restart')
    reset.addEventListener('click', playAgain)

    const showRules = document.querySelector('.rulesModal')
    const menuBtn = document.querySelector('.btn.menu')
    menuBtn.addEventListener('click',displayRules)

    const closeRules = document.querySelector('.closeRules')
    closeRules.addEventListener('click',() =>{
        showRules.style.display = 'none'
    })

    function displayRules(){
        //if(!playing) return
        showRules.style.display = 'flex'
        
    }

    function playAgain(e){
        if(e.target.id != 'playAgain'){
            player1Dom.textContent = 0
            player2Dom.textContent = 0
            gameController.resetScores() 
        }

        gameController.resetGame()
        timeLeft.textContent = "5s"
        turnText.textContent = "Player 1's Turn"
        turnDisplay.style.backgroundColor = "#ff6488";
        winnerDisplay.style.display = 'none'
        turnDisplay.style.display = 'flex'

    }


    const incScore = function (winner){
       if (winner.getChip() == 'player1')
            player1Dom.textContent = winner.getScore()
       else
            player2Dom.textContent = winner.getScore()
    }

    const setTurnText = function(turn, color){
        let text = turn == 'player1'? "Player 1's Turn":"Player 2's Turn"
        turnText.textContent = text
        turnDisplay.style.backgroundColor = `#${color}`
    }

    const setWinner = function(player,message){
        if(message == 'DRAW'){
            winner.style.display = 'none'
        }
        else
        {   winner.style.display = 'block';
            winner.textContent = player.getChip() == 'player1'? "Player 1": "Player 2";
        }
        wins.textContent = message;   
    }

    const changeDisplay =  function(){
        turnDisplay.style.display = 'none';
        winnerDisplay.style.display = 'flex';
    }

    const setTimer = (seconds) =>{
        timeLeft.textContent = `${seconds}s`
    }
    return {incScore,setTurnText,setWinner,changeDisplay,setTimer}

})()
    

