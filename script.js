/* Script for Tic-Tac-Toe */

//Let's start with players
class Player{
    //We create a player who has the following properties
    //A id which is used to check if it's their turn or not
    //A name
    //Choice indicates their choice of whether they put cross or circle
    //-1 means empty cell, 0 represents circle and 1 represents cross (ideally a player's is always 0 or 1)
    constructor(id,name,choice){
        this.id=id
        this.name=name;
        this.choice=choice;
    }
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

//Intiating both the players with random choice, note that the first player is always player 1
let Player1,Player2,currentPlayer;
let Player1_Score,Player2_Score;
function initPlayers(){
    Player1= new Player(0,"Player 1",randInt(0,2));
    Player2=new Player(1,"Player 2",Player1.choice ? 0:1);
    currentPlayer=Player1;
}
function initPlayerScores(){
    if (localStorage.getItem('TicTacToeScore_Player1')==null)
        localStorage.setItem('TicTacToeScore_Player1',0);
    if (localStorage.getItem('TicTacToeScore_Player2')==null)
        localStorage.setItem('TicTacToeScore_Player2',0);
}
function resetPlayerScores(){
    if (localStorage.TicTacToeScore_Player1!=null)
        localStorage.TicTacToeScore_Player1=0;
    if (localStorage.TicTacToeScore_Player2!=null)
        localStorage.TicTacToeScore_Player2=0;
}
initPlayerScores();
//We will use the currentPlayer to keep track of whose turn it is now and whose next
//Implementation of player 1 coming first


//Before we move onto the table it would be helpful to keep a removeAllEventListeners function
function replaceWithClone(NodeElement){
    NodeElement.replaceWith(NodeElement.cloneNode(true));
}
const removeAllEventListeners=replaceWithClone;

//We will use table implementation of tictactoe. (Interesting Note is that until game-table generation it's all independednt of currentPlayer)
//-1 means empty cell, 0 represents circle and 1 represents cross
let gameMatrix; //This is the global matrix which contains the data of the matrix in number format
let gameTable;
//Creates an empty genEmptyGameMatrix
function genEmptyGameMatrix(N){
    let gameMatrix=[];
    let row=[];
    for (let i=0;i<N;++i) {row.push(-1);}
    for (let i=0;i<N;++i) {gameMatrix.push([...row]);}
    return gameMatrix;

    /* Would youu believe me if I said that this function caused the biggest breakage of functionality since I began this project till I implemented the makeTurnWrapper and the win lose mechanics? Despite this beign one of the first functions written (also, no, the functions aren't arranged chronologically) and also one of the simplest and without any dependency, this was the one which caused huge error.
    Basically, all the arrays in gameMatrix were being passed by reference when I used .push(row), due to this, any change I make to any element in a row, it would be reflected in all rows.
    Seriously, goddamn! And here's the reference of old version

    let gameMatrix=[];
    let row=[];
    for (let i=0;i<N;++i) {row.push(-1);}
    for (let i=0;i<N;++i) {gameMatrix.push(row);}
    return gameMatrix; */
}

gameMatrix=genEmptyGameMatrix(3);
initMatch(); //Defined much later

//In this function, we assume gameMatrix is always a square, which can be easily modified btw
//Also, this renders empty matrix as you can see, because each individual modification can be carried by a function
function renderEmptyGameMatrix(gameMatrix,parentNode){
    //create table and table body

    const table=document.createElement("table");
    table.id='game-table';
    const tableBody=document.createElement("tbody");

    //keeping rowno and colno for more readability
    const rowno=gameMatrix.length;
    const colno=gameMatrix[0].length;

    for (let i=0;i<rowno;++i){
        //Create row
        const row=document.createElement("tr");
        
        for (let j=0;j<colno;++j){
            const cell= document.createElement("td");

            const cellContent=document.createElement('img');
            cellContent.src='./assets/blank.png';
            cellContent.alt='A';

            cellContent.addEventListener('click',makeTurnWrapper(i,j));
            
            cell.appendChild(cellContent);

            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    }
    table.appendChild(tableBody);
    parentNode.appendChild(table);
    
}

//Functions to access the items in table
//Function which takes the table node and returns rownode by index
function getRow(tableNode,index=0){
    const tbody=tableNode.querySelector('tbody');
    return tbody.querySelectorAll('tr')[index];
}

//Function which takes tableNode and index of cell and returns the cell node
function getCell(tableNode,index_i=0,index_j=0){
    return getRow(tableNode,index_i).querySelectorAll('td')[index_j];
}

function getGameTable(){
    return document.querySelector('#game-table');
}

//The above part is for generation of game-matrix etc.
//Now let's add player mechanics
function getCurrentTurn(){
    return currentPlayer.choice;
}

function changeTileHelper(i,j,newTileValue,gameTable) {
    //newTileValue refers to newTileValue of cell which is being changed. Refer to gameMatrix defn for state usage
    gameMatrix[i][j] = newTileValue;
    let tileCell= getCell(gameTable,i,j);

    if (newTileValue===0) {
        tileCell.innerHTML='<img src="./assets/circle.png" alt="circle">';
    } else if (newTileValue===1) {
        tileCell.innerHTML='<img src="./assets/cross.png" alt="cross">'
    }
}

function changeTile(i,j){
    changeTileHelper(i,j,getCurrentTurn(),gameTable);
}

//This changes the indicator to cross if choice given is 1 and circle if choice given is 0.
function changeIndicatorHelper(choice){
    if (choice==0){//If you want to change circle..
        document.querySelector('#circle-indicator').className='active-indicator';
        document.querySelector('#cross-indicator').className=null;
    }
    if (choice==1){//Vice-versa
        document.querySelector('#cross-indicator').className='active-indicator';
        document.querySelector('#circle-indicator').className=null;
    }
}

function initIndicator(){//Inititates the indicator
    changeIndicatorHelper(getCurrentTurn());
}

function changeIndicator(){//This toggles the indicator
    const nextTurn=getCurrentTurn() ? 0:1;
    changeIndicatorHelper(nextTurn);
}

function changeCurrentPlayer(){
    const currentTurn=getCurrentTurn();
    //If the ongoing turn is player1's, in which case current turn (cross or circle) is equal to player1's choice (cross or circle) hence currentPlayer becomres Player2;
    if (currentTurn==Player1.choice) currentPlayer=Player2;
    else currentPlayer=Player1;
}

function initMatch(){
    initPlayers();
    initIndicator();
    //Rendering done using functions
    renderEmptyGameMatrix(gameMatrix,document.getElementById('game-matrix'));
    gameTable=getGameTable();//Making the global gametable as the current gameTable.
    updateScoreHTML();

    /* Note that intiMatch() is used everytime the match is reset AND also when the game is inititalised. 
    Despite realising it late, I think it's pretty obvious that every action done at the first instance of the game has to be somewhat repeated everytime the game is reset and hence, all starts of match are identical. Well, to drive this point into the mind, consider the following comments I had written in resetMatch before.
    Currently, the gameMatrix=genEmptyMatrix(3) or (N) isn't present but it will soon be included under the initMatch() after I create the input element for entering N

    //Resetting global variable gameMatrix
    gameMatrix=genEmptyGameMatrix(3);
    renderEmptyGameMatrix(gameMatrix,gameMatrixDiv);
    //changeTile relies on global variable gameTable which got nullified due to previous emptying of gameMatrixDiv
    gameTable=getGameTable();
    initPlayers();
    */
}
function resetMatch(){
    const gameMatrixDiv=document.getElementById('game-matrix');
    gameMatrixDiv.innerHTML='';//Making the game matrix empty again
    removeWinDeclarations();//We remove the declarations before starting again
    //Resetting global variable gameMatrix
    gameMatrix=genEmptyGameMatrix(3);
    initMatch();
}

function resetGame(){
    resetPlayerScores();
    resetMatch();
}

//Now let's apply styles onto the table
//Basically I will be adding classes to the cells now, like in-topmost, in-rightmost, in-leftmost, and in-bottommost
//Also, our assumption of a square is still hardcoded despite there being no necessity of a square.
function styleTable(tableNode,N_size_gamematrix){
    let topCell,bottomCell,leftCell,rightCell;
    for (let j=0;j<N_size_gamematrix;++j){
        topCell=getCell(tableNode,0,j);
        topCell.classList.add('in-topmost');
        bottomCell=getCell(tableNode,N_size_gamematrix-1,j);
        bottomCell.classList.add('in-bottommost');
    }
    for (let i=0;i<N_size_gamematrix;++i){
        leftCell=getCell(tableNode,i,0);
        leftCell.classList.add('in-leftmost');
        rightCell=getCell(tableNode,i,N_size_gamematrix-1);
        rightCell.classList.add('in-rightmost');
    }
}
styleTable(gameTable,3);

//Temporary function to print matrix
function toStringMatrix(Matrix){
    return `{${Matrix.join(",")}}`;
}
const gameMatrixString= () => toStringMatrix(gameMatrix) ;

//To check the winning condititons, we need to check if there's a row or column or diagonal with the same value.
//For that let's write is___All functions which return is an entire row, column or diagonal has the value given, provided the index of row, column, or diagonal (main diags only).
//There's another possibility of implementation where we check if entire row has the same value or not if the row is uniform, then we declare the player with the choice same as that row's elements as the winner. But I think writing this way would be convenient, deespite it's inefficiency.
function isRowAll(value,row_index,Matrix){

    const row_size=Matrix[0].length;
    for (let j=0;j<row_size;++j){
        if (Matrix[row_index][j]!=value) return false;
    }
    return true;
}
function isColAll(value,col_index,Matrix){

    const col_size=Matrix.length;
    for (let i=0;i<col_size;++i){
        if (Matrix[i][col_index]!=value) return false;
    }
    return true;
}

function isValidIndex(i,j,Matrix){
    //console.log(`isValid speaking: I got (${i},${j}) and matrix as`,gameMatrixString());
    return (i>=0)&&(i<Matrix[0].length)&&(j>=0)&&(j<Matrix.length);
}

function isLeftDiagonalAll(value,Matrix){
    const sqmatrixOrder=Matrix.length;
    
    for (let i=0;i<sqmatrixOrder;++i){
        if (Matrix[i][i]!=value) return false;
    }
    return true;
}
function isRightDiagonalAll(value,Matrix){
    const sqmatrixOrder=Matrix.length;
    
    for (let i=0;i<sqmatrixOrder;++i){
        if (Matrix[i][sqmatrixOrder-1-i]!=value) return false;
    }
    return true;
}

function isWinner(player,gameMatrix){
    playerChoice=player.choice;
    let row_size=gameMatrix[0].length, col_size=gameMatrix.length;
    
    //Checking rows
    for (let i=0;i<col_size;++i){
        if (isRowAll(playerChoice,i,gameMatrix)) {
            return true;
        }
    }
    
    //Checking cols
    for (let j=0;j<row_size;++j){
        if (isColAll(playerChoice,j,gameMatrix)) {
            return true;
        }
    }
    
    //Checking both diagonals
    if (isLeftDiagonalAll(playerChoice,gameMatrix)) return true;
    if (isRightDiagonalAll(playerChoice,gameMatrix)) return true;

    return false;
}

//A match is considered over if all elements of gameMatrix are 0 or 1. i.e. if all elements are "non -1".
function isMatchOver(gameMatrix){
    //Following is a bool of whether every element is "non -1" or not, basically, checking if -1 is not-there(true) or thre (false).
    return gameMatrix.every(row => row.every( elem => (elem!=-1)));
}

function getWinStatus(){
    //winStatus of 0 indicates player 1 has won, 1 indicates player 2 has won, 2 indicates a draw, -1 indicates neither has won and the game is ongoing, nowonwards referred to as ongoing state.
    if (isWinner(Player1,gameMatrix)) return 0;
    if (isWinner(Player2,gameMatrix)) return 1;
    if (isMatchOver(gameMatrix)) return 2;
    return -1;
}

function updateScoreHTML(){
    const player1ScoreBox=document.getElementById("player1-score-container");
    const player2ScoreBox=document.getElementById("player2-score-container");
    player1ScoreBox.innerText=localStorage.TicTacToeScore_Player1;
    player2ScoreBox.innerText=localStorage.TicTacToeScore_Player2;

    //Now we add leading-score class to highlight who's ahead
    //First let's directly remove any leading-score classes if-present, because we don't know who's going to be at lead now
    //Btw, no check is needed to see if the leadin-score is present in the classList because even if not present .remove doesn't throw an error
    player1ScoreBox.classList.remove('leading-score');
    player2ScoreBox.classList.remove('leading-score');
    if (Number(localStorage.TicTacToeScore_Player1)>Number(localStorage.TicTacToeScore_Player2))
        player1ScoreBox.classList.add('leading-score')
    else if (Number(localStorage.TicTacToeScore_Player2)>Number(localStorage.TicTacToeScore_Player1))
        player2ScoreBox.classList.add('leading-score')
}

function updateScore(playerID){//Though I have hardcoded the ids in == statements, they can be replaced by Playerx.id
    if (playerID==0) localStorage.TicTacToeScore_Player1++;
    else if (playerID==1) localStorage.TicTacToeScore_Player2++;
    updateScoreHTML();
}

function putWinDeclaration(winnerName,afterNode=document.getElementById('reset-game-container')){
    const winnerBox=document.createElement('div');
    winnerBox.className='win-declaration-container';
    const winnerText=`${winnerName} has won the match!!`;
    const winnerTextElement=document.createElement('h2');
    winnerTextElement.innerText=winnerText;
    winnerBox.appendChild(winnerTextElement);
    document.body.insertBefore(winnerBox,afterNode);
}

function removeWinDeclarations(){
    //Removes all winner declarations (which should ideally be 1)
   document.querySelectorAll('.win-declaration-container').forEach((winnerBox)=> {winnerBox.remove();})
}

function makeTurnWrapper(i,j){
    //Returns the function to be executed when a cell is clicked

    const makeTurn= ()=>{
        changeTile(i,j);
        
        const winStatus=getWinStatus();
        //console.log(`Winstatus: ${winStatus}`)
        if (winStatus==0){
            updateScore(Player1.id);//I could have written 0 directly, but more readability
            putWinDeclaration(Player1.name);
        } else if (winStatus==1){
            updateScore(Player2.id);
            putWinDeclaration(Player2.name);
        }

        if ((winStatus==0)||(winStatus==1)||(winStatus==2)){ //Could've made it more efficient by winStatus!=-1 but this more readable
            removeAllEventListeners(document.querySelector('#game-table'));//Make the board irresponsive
            setTimeout(resetMatch,5000);//Reset match in 5 seconds
        }
        if (winStatus==-1){//If ongoing change indicator and player
            changeIndicator();
            changeCurrentPlayer();
        }
    }

    return makeTurn;
}

const overlay = document.querySelector(".overlay");

const modal1 = document.querySelector("#reset-board-modal");
const openModalBtn1 = document.querySelector("#reset-board");
const closeModalBtn1 = document.querySelector("#btn-close-1");
const confirmModalBtn1 = document.querySelector("#confirm-reset-board");

const modal2 = document.querySelector("#reset-fullgame-modal");
const openModalBtn2 = document.querySelector("#reset-fullgame");
const closeModalBtn2 = document.querySelector("#btn-close-2");
const confirmModalBtn2 = document.querySelector("#confirm-reset-fullgame");

function addModalOpenClose(modalNode,overlayNode,openModalBtn,closeModalBtn){
    openModalBtn.addEventListener('click',()=>{
        modalNode.classList.remove("hidden");
        overlayNode.classList.remove('hidden');
    });
    closeModalBtn.addEventListener('click',()=>{
        modalNode.classList.add("hidden");
        overlayNode.classList.add('hidden');
    });
}

addModalOpenClose(modal1,overlay,openModalBtn1,closeModalBtn1);
confirmModalBtn1.addEventListener('click',()=>{
    resetMatch();
    modal1.classList.add("hidden");
    overlay.classList.add('hidden');
});

addModalOpenClose(modal2,overlay,openModalBtn2,closeModalBtn2);
confirmModalBtn2.addEventListener('click',()=>{
    resetGame();
    modal1.classList.add("hidden");
    overlay.classList.add('hidden');
});